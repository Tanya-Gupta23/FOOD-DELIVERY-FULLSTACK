import { useEffect } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentAddress,setCurrentCity,setCurrentState, setUserData } from "../src/redux/userSlice.js";
import { setAddress, setLocation } from "../src/redux/mapSlice.js";
import { serverUrl } from "../src/App.jsx";


const useUpdateLocation = () => {
  const dispatch = useDispatch();
  const {userData}= useSelector(state=>state.user)

  useEffect(() => {
    const updateLocation= async(lat, lon)=>{
        const result= await axios.post(`${serverUrl}/api/user/update-location`,{lat,lon}, 
          {withCredentials:true})
        console.log(result.data)
    }
//when we need to caall update location???-> when the lat and lon change
    navigator.geolocation.watchPosition((pos)=>{
      updateLocation(pos.coords.latitude, pos.coords.longitude)
    })
 
      
},[userData])
}


export default useUpdateLocation 