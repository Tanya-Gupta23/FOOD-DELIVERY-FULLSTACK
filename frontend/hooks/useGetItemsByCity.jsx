import { useEffect } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setShopsInMyCity, setUserData, setItemsInMyCity } from "../src/redux/userSlice.js";

const useGetItemsByCity = () => {
    const dispatch= useDispatch()
    const {currentCity} = useSelector(state=>state.user)
    useEffect(() => {
    if (!currentCity) return;

    const fetchItems = async () => {
        try {
            const res = await axios.get(
                `http://localhost:8000/api/item/get-by-city/${currentCity}`,
                {
                    withCredentials: true,
                }
            );

            dispatch(setItemsInMyCity(res.data));
            console.log(res.data);

        } catch (error) {
            console.log(error.response?.data?.message);
        }
    };

    fetchItems();
}, [currentCity]);
}

export default useGetItemsByCity;