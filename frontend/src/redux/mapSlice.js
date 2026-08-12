import { createSlice } from "@reduxjs/toolkit";

const mapSlice= createSlice({
    name:"user",
    initialState:{
        location:{
            lat:null,
            lon:null
        },
        address:null

    },
    
    
    reducers:{
        setLocation:(state,action)=>{
            const {lat,lon}=action.payload
            state.location.lat=lat
            state.location.lon=lon
        },
        setAddress:(state,action)=>{
            state.address=action.payload

        }
        

    }
})

export const { setAddress, setLocation} = mapSlice.actions;
//const setUserData = userSlice.actions.setUserData;
export default mapSlice.reducer;