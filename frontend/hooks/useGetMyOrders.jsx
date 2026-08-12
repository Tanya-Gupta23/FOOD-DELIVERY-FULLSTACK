import { useEffect } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { serverUrl } from "../src/App";

import { setMyOrders } from "../src/redux/userSlice";

const useGetMyOrders = () => {
  const dispatch = useDispatch();
  const {userData}= useSelector(state=>state.user)
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const result = await axios.get(
          `${serverUrl}/api/order/my-orders`,
          {
            withCredentials: true,
          }
        );

        dispatch(setMyOrders(result.data));
        console.log(result.data)
      } catch (error) {
        console.log(error.response?.data?.message);
      }
    };

    fetchOrders();
  }, [userData]);
};

export default useGetMyOrders;