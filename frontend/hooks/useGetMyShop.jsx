import { useEffect } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { serverUrl } from "../src/App";
import { setMyShopData } from "../src/redux/ownerSlice";

const useGetMyShop = () => {
  const dispatch = useDispatch();
  const {userData}= useSelector(state=>state.user)
  useEffect(() => {
    const fetchShop = async () => {
      try {
        const result = await axios.get(
          `${serverUrl}/api/shop/get-my`,
          {
            withCredentials: true,
          }
        );

        dispatch(setMyShopData(result.data));
      } catch (error) {
        console.log(error.response?.data?.message);
      }
    };

    fetchShop();
  }, [userData]);
};

export default useGetMyShop;