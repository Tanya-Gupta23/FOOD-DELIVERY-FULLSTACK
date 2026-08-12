import { useEffect } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setShopsInMyCity, setUserData } from "../src/redux/userSlice.js";

const useGetShopByCity = () => {
    const dispatch= useDispatch()
    const {currentCity} = useSelector(state=>state.user)
    useEffect(() => {
    if (!currentCity) return;

    const fetchShops = async () => {
        try {
            const res = await axios.get(
                `http://localhost:8000/api/shop/get-by-city/${currentCity}`,
                {
                    withCredentials: true,
                }
            );

            dispatch(setShopsInMyCity(res.data));
            console.log(res.data);

        } catch (error) {
            console.log(error.response?.data?.message);
        }
    };

    fetchShops();
}, [currentCity]);
}

export default useGetShopByCity;