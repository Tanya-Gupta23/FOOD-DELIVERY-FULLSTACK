import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { serverUrl } from '../App'
import { useNavigate } from "react-router-dom";
import { IoMdArrowBack } from "react-icons/io";

import axios from 'axios'
import DeliveryBoyTracking from '../components/deliveryBoyTracking';
import { useSelector } from 'react-redux';
//map for user
function TrackOrderPage() {
    const navigate = useNavigate();
    const {socket}= useSelector(state=>state.user)
    const { orderId } = useParams()
    const [currentOrder, setCurrentOrder] = useState()
    const [liveLocations, setLiveLocations]= useState({})
    const handleGetOrder = async () => {
        //
        try {
            const result = await axios.get(`${serverUrl}/api/order/get-order-by-id/${orderId}`, { withCredentials: true })
            console.log(result.data)
            setCurrentOrder(result.data)
        } catch (error) {
            console.log(error)

        }
    }

    useEffect(()=>{
        socket.on('updateDeliveryLocation',({deliveryBoyId, latitude, longitude})=>{
            setLiveLocations(prev=>({
                ...prev,
                [deliveryBoyId]:{lat: latitude,lon:longitude}
            }))

        })
    }, [socket])

    useEffect(() => {
        handleGetOrder()

    }, [orderId])
    return (
            <div className="max-w-4xl mx-auto p-4 flex flex-col gap-6">
                <div
                    className="relative flex items-center gap-4 top-[20px] left-[20px] z-[10] mb-[10px] cursor-pointer"
                    onClick={() => navigate("/my-orders")}
                >
                    <IoMdArrowBack 
                        size={35}
                        className="text-[#ff4d2d]"
                    />

                    <h1 className="text-2xl font-bold md:text-center">
                        Track Order
                    </h1>
                </div>

                {currentOrder?.shopOrders?.map((shopOrder, index)=>{
                    return(
                    <div className='bg-white p-4 rounded-2xl shadow-md border border-[#ff2d4d] space-y-4' key={index}>
                        <div>
                            <p className='text-lg font-bold mb-2 text-[#ff4d2d]'>{shopOrder.shop.name}</p>
                            <p className='font-semibold'><span>Items: </span>{shopOrder.shopOrderItems?.map(i=>i.item.name).join(",")}</p>
                            <p><span className='font-semibold'>Subtotal: </span>{shopOrder.subtotal}</p>
                            <p className='mt-4'><span className='font-semibold'>Delivery Address: </span>{currentOrder.deliveryAddress?.text}</p>
                        </div>

                        {shopOrder.status!="delivered"?
                        <>
                        {shopOrder.assignedDeliveryBoy?
                        <div className='text-sm text-gray-700'>
                            <p className='font-semibold'><span>Delivery Agent Name: </span>{shopOrder.assignedDeliveryBoy.fullName}</p>
                            <p className='font-semibold'><span>Delivery Agent Contact No.: </span>{shopOrder.assignedDeliveryBoy.mobile}</p>
                        </div>:
                        <p className='font-semibold'>Delivery Agent is not assigned yet</p>}
                        </>:
                        <p className='text-green-600 font-semibold text-lg'>Delivered</p>}

                        {(shopOrder.assignedDeliveryBoy && shopOrder.status!=="delivered") && (
  <div className="h-[400px] w-full rounded-2xl overflow-hidden shadow-md">
    <DeliveryBoyTracking
      data={{
        deliveryBoyLocation: liveLocations[shopOrder.assignedDeliveryBoy._id] ||{
          lat: shopOrder.assignedDeliveryBoy.location.coordinates[1],
          lon: shopOrder.assignedDeliveryBoy.location.coordinates[0],
        },
        customerLocation: {
          lat: currentOrder.deliveryAddress.latitude,
          lon: currentOrder.deliveryAddress.longitude,
        },
      }}
    />
  </div>
)}

                    </div>
                    )
                })}
            </div>

        
    )
}

export default TrackOrderPage
