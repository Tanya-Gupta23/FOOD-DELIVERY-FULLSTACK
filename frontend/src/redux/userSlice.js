/*
Redux ka kaam hai data ko ek central/global 
jagah par rakhna, taaki alag-alag React 
components us data ko access kar saken.

Ek slice = Redux store ke data ka ek section.
Redux Store
│
├── user
│   └── userData
│
├── cart
│   └── cartItems
│
└── restaurant
    └── restaurantData


Is slice ka naam user hai. Redux internally is naam
 ko actions identify karne mein use karta hai.

 state → current Redux data
action → jo instruction/data bheja gaya hai
action.payload → actual data jo tum Redux ko bhej rahi ho

Example:

dispatch(setUserData({
    fullName: "Tanya",
    email: "tanya@gmail.com"
}));

Tab internally:

action.payload

ki value hogi:

{
    fullName: "Tanya",
    email: "tanya@gmail.com"
}

Aur ye line:

state.userData = action.payload;

Redux state ko bana degi:

userData: {
    fullName: "Tanya",
    email: "tanya@gmail.com"
}


Backend se user data mila
        ↓
dispatch(setUserData(data))
        ↓
data → action.payload
        ↓
setUserData reducer chala
        ↓
state.userData = action.payload
        ↓
Redux Store mein user data save ✅
 */
import { createSlice } from "@reduxjs/toolkit";
import MyOrders from "../pages/MyOrders";

const userSlice= createSlice({
    name:"user",
    initialState:{
        userData: null,
        currentCity:"",
        currentState:"",
        currentAddress: "",
        shopsInMyCity: null,
        itemsInMyCity:null,
        cartItems:[],
        totalAmount:0,
        myOrders: [],
        searchItems:null,
        socket: null

    },
    reducers:{
        setUserData:(state, action)=>{
            state.userData= action.payload// action se vo state mein chla gya data
        },
        setCurrentCity:(state, action)=>{
            state.currentCity= action.payload// action se vo state mein chla gya data
        },
        setCurrentState:(state, action)=>{
            state.currentState= action.payload// action se vo state mein chla gya data
        },
        setCurrentAddress:(state, action)=>{
            state.currentAddress= action.payload// action se vo state mein chla gya data
        },
        setShopsInMyCity:(state, action)=>{
            state.shopsInMyCity= action.payload// action se vo state mein chla gya data
        },
        setItemsInMyCity:(state, action)=>{
            state.itemsInMyCity= action.payload// action se vo state mein chla gya data
        },
        addToCart:(state,action)=>{
            const cartItem= action.payload
            const existingItem=  state.cartItems.find(i=>i.id==cartItem.id)
            if(existingItem){
                existingItem.quantity+=cartItem.quantity
            }
            else{
                state.cartItems.push(cartItem)
            }
            state.totalAmount=state.cartItems.reduce((sum,i)=>sum+i.price*i.quantity,0)
        },
        updateQuantity:(state,action)=>{
            const {id, quantity}=action.payload
            const item= state.cartItems.find(i=>i.id==id)
            if(item){
                item.quantity= quantity
            }
            state.totalAmount=state.cartItems.reduce((sum,i)=>sum+i.price*i.quantity,0)
        },
        removeCartItem:(state,action)=>{
            state.cartItems=state.cartItems.filter(i=>i.id!=action.payload)
            state.totalAmount=state.cartItems.reduce((sum,i)=>sum+i.price*i.quantity,0)
        },
        setMyOrders:(state,action)=>{
            state.myOrders=action.payload        
        },
        //taaki bina refresh kare hi jaise hi order place ho hme apne my order mein show hone lag jaae
        addMyOrder:(state, action)=>{
            state.myOrders=[action.payload,...state.myOrders]
        },
        //so that when user changes the status it will directly visible to us without refreshing
        updateOrderStatus:(state, action)=>{
            const {orderId, shopId, status}= action.payload
            const order= state.myOrders.find(o=>o._id==orderId)
            if(order){
                if(order.shopOrders && order.shopOrders.shop._id==shopId){
                    order.shopOrders.status= status
                }
            }
        },
        updateRealTimeOrderStatus:(state, action)=>{
            const {orderId, shopId, status}= action.payload
            const order= state.myOrders.find(o=>o._id==orderId)
            if(order){
                const shopOrder=order.shopOrders.find(so=>so.shop._id==shopId)
                if(shopOrder){
                    shopOrder.status=status
                }
                }
            }
            

        ,
        setSearchItems: (state, action)=>{
            state.searchItems=action.payload
        },
        setSocket: (state, action)=>{
            state.socket=action.payload
        }
}
})

export const {updateRealTimeOrderStatus, setSocket, setSearchItems, updateOrderStatus, addMyOrder, setMyOrders, setUserData,setCurrentCity, setCurrentAddress,setCurrentState, setShopsInMyCity,  setItemsInMyCity , addToCart, updateQuantity, removeCartItem} = userSlice.actions;
//const setUserData = userSlice.actions.setUserData;


export default userSlice.reducer;