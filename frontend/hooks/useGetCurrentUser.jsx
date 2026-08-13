import { useEffect } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setUserData } from "../src/redux/userSlice.js";
import { serverUrl } from "../App";

const useGetCurrentUser = () => {
    const dispatch= useDispatch()
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await axios.get(`${serverUrl}/api/user/current`, {
    withCredentials: true
});
                dispatch(setUserData(res.data))
            } catch (error) {
                console.log(error.response?.data?.message);
            }

        };
        fetchUser();
    }, []);

};

export default useGetCurrentUser;
