import React, { useEffect } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import SignUp from './pages/SignUp'
import SignIn from './pages/SignIn'
import Home from './pages/Home'
import ForgotPassword from './pages/ForgotPassword'
import CreateEditShop from "./pages/CreateEditShop"
import AddItem from './pages/AddItem'
import EditItem from './pages/EditItem'
import CartPage from './pages/CartPage'
import useGetCurrentUser from '../hooks/useGetCurrentUser'
import { useDispatch, useSelector } from 'react-redux'
export const serverUrl = "http://localhost:8000"
import useGetCity from "../hooks/useGetCity";
import useGetMyShop from '../hooks/useGetMyShop'
import useGetShopByCity from '../hooks/useGetShopByCity'
import useGetItemsByCity from '../hooks/useGetItemsByCity'
import Checkout from './pages/Checkout'
import OrderPlaced from './pages/OrderPlaced'
import MyOrders from './pages/MyOrders'
import useGetMyOrders from '../hooks/useGetMyOrders'
import useUpdateLocation from '../hooks/useUpdateLocation'
import TrackOrderPage from './pages/TrackOrderPage'
import Shop from './pages/Shop'
import io from 'socket.io-client'
import { setSocket } from './redux/userSlice'
function App() {
  useGetCurrentUser();
  useGetCity();
  useGetMyShop();
  useGetShopByCity();
  useGetItemsByCity();
  useGetMyOrders();
  useUpdateLocation();
  
  const {userData}= useSelector(state=>state.user)
  const dispatch= useDispatch()

  useEffect(()=>{
    const socketInstance=io(serverUrl,{withCredentials:true})
    dispatch(setSocket(socketInstance))
    socketInstance.on('connect', ()=>{
      if(userData){
        socketInstance.emit('identity',{userId: userData._id})
      }
    })
    return ()=>{
      socketInstance.disconnect()
    }
    
  },[userData?._id])
  
  return (
    <Routes>
      <Route path='/signup' element={!userData?<SignUp/>: <Navigate to={"/"}/>}/>
      <Route path='/signin' element={!userData?<SignIn/>: <Navigate to={"/"}/>}/>
      <Route path='/forgot-password' element={!userData?<ForgotPassword/>: <Navigate to={"/"}/>}/>
      <Route path='/' element={userData?<Home/>: <Navigate to={"/signin"}/>}/>
      <Route path="/create-edit-shop" element={userData ? <CreateEditShop/> : <Navigate to="/signin" />}/>
      <Route path="/add-item" element={userData ? <AddItem/> : <Navigate to="/signin" />}/>
      <Route path="/edit-item/:itemId" element={userData ? <EditItem/> : <Navigate to="/signin" />}/>
      <Route path="/cart" element={userData ? <CartPage/> : <Navigate to="/signin" />}/>
      <Route path="/checkout" element={userData ? <Checkout/> : <Navigate to="/signin" />}/>
      <Route path="/order-placed" element={userData ? <OrderPlaced/> : <Navigate to="/signin" />}/>
      <Route path="/my-orders" element={userData ? <MyOrders/> : <Navigate to="/signin" />}/>
      <Route path="/track-order/:orderId" element={userData ? <TrackOrderPage/> : <Navigate to="/signin" />}/>
      <Route path="/shop/:shopId" element={userData ? <Shop/> : <Navigate to="/signin" />}/>

      
    
    </Routes>

  )
}

export default App
