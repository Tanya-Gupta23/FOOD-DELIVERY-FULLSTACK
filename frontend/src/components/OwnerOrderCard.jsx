import React, { useState } from 'react'
import { MdPhone } from "react-icons/md";
import { serverUrl } from '../App';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { updateOrderStatus } from '../redux/userSlice';

function OwnerOrderCard({ data }) {
     console.log(data.shopOrders);
    console.log(data.shopOrders.assignedDeliveryBoy);

    const [availableBoys, setAvailableBoys]= useState([])
    const dispatch= useDispatch()
    // fetching the update staus route
    const handleUpdateStatus = async (orderId, shopId, status) => {
        try {
            const result= await axios.post(`${serverUrl}/api/order/update-status/${orderId}/${shopId}`, {status},{withCredentials:true})
            dispatch(updateOrderStatus({orderId, shopId, status}))
            setAvailableBoys(result.data.availableBoys)
            console.log(result.data)
        } catch (error) {
            console.log(error)
        }

        
    }
    const formatDate = (dateString) => {
        const date = new Date(dateString)
        return date.toLocaleString('en', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        })
    }
    

    return (
        <div className="bg-white rounded-xl shadow-md p-5 space-y-5">

            {/* Header */}
            <div className="border-b pb-4 space-y-2">

                <p className="font-bold text-lg">
                    {data.user.fullName}
                </p>

                <p className="text-sm text-gray-500">
                    {data.user.email}
                </p>

                <p className="text-sm text-gray-500 flex items-center gap-2">
                    <MdPhone />
                    <span>{data.user.mobile}</span>
                </p>

                <div className="flex-col text-sm text-gray-600">

                    <p>
                        {data.deliveryAddress.text}
                    </p>
                    <p className='text-xs text-gray-500'>Lat: {data.deliveryAddress.latitude}, Lon: {data.deliveryAddress.longitude}</p>
                </div>
                <div className="flex justify-between items-center pt-2">

                    <p className="text-xs text-gray-400">
                        Order Date: {formatDate(data.createdAt)}
                    </p>

                    <span className="text-xs font-medium bg-gray-100 px-3 py-1 rounded-full">
                        {data.paymentMethod.toUpperCase()}
                    </span>

                </div>

            </div>


            {/* Items */}
            <div className="flex gap-4 overflow-x-auto">

                {data.shopOrders.shopOrderItems.map((item, index) => (

                    <div
                        key={index}
                        className="min-w-[140px] border rounded-lg bg-white p-2"
                    >

                        <img
                            src={item.item.image}
                            alt=""
                            className="w-full h-24 rounded object-cover"
                        />

                        <p className="font-semibold text-sm mt-2">
                            {item.item.name}
                        </p>

                        <p className="text-xs text-gray-500">
                            Qty : {item.quantity} x ₹{item.price}
                        </p>

                        

                    </div>

                ))}

            </div>

            {/* Status */}
            <div  className='flex justify-between items-center mt-auto pt-3 border-t border-gray-100'>
                <span className='text-sm'> Status: <span className='font-semibold text-[#ff4d2d]'>{data.shopOrders.status.toUpperCase()} </span></span>

                <select  className='rounded-md border px-3 py-1 text-sm focus:outline-none focus:ring-2 border-[#ff4d2d] text-[#ff4d2d]' onChange={(e)=>handleUpdateStatus(data._id, data.shopOrders.shop._id, e.target.value)}>
                    <option value="">Change</option>
                    <option value="placed">Placed</option>
                    <option value="preparing">Preparing</option>
                    <option value="out for delivery">Out for Delivery</option>
                </select>

            </div>

            {/*Printing the names of all the available del boys */}

            {data.shopOrders.status=="out for delivery" &&
            <div className='mt-3 p-2 border rounded-lg text-sm bg-orange-50'>
                {data.shopOrders.assignedDeliveryBoy?<p>Assigned Delivery Boy: </p>:<p>Available Delivery Boys: </p>}
                {(availableBoys || []).length > 0?(
                    availableBoys.map((b, index)=>(
                        <div className='text-gray-600'>
                            {b.fullName}-{b.mobile}
                        </div>
                    ))

                ):(
                    data.shopOrders.assignedDeliveryBoy?<div className='flex gap-2 items-center'>
                        {data.shopOrders.assignedDeliveryBoy.fullName}- <MdPhone/> <span>{data.shopOrders.assignedDeliveryBoy.mobile}</span>
                    </div>:
                    <p>No delivery boy available</p>
                )}

            </div>
            }

            {/* Total */}
            <div className='text-right font-bold text-gray-800 text-sm'>
                Total: ₹{data.shopOrders.subtotal}
            </div>


            







        </div>
    )
}

export default OwnerOrderCard