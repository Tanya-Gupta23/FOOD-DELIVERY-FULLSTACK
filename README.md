# Feasto – Food Delivery App

## About the Project

Feasto is a full-stack food delivery web application that connects **customers, shop owners, and delivery personnel** on a single platform.

Customers can browse shops and food items based on their city, add items to their cart, place orders, and track deliveries. Shop owners can manage their shops, food items, and incoming orders. Delivery personnel can receive delivery assignments, accept orders, share their live location, and complete deliveries using OTP verification.

The application combines **REST APIs, MongoDB, authentication, geolocation, interactive maps, and Socket.IO-based real-time communication** to manage the complete food ordering and delivery process.

## Features

### 👤 Customer

* User registration and login
* Google authentication
* Browse shops and food items by city
* Search food items
* Add and manage cart items
* Select delivery address using an interactive map
* Place orders using Cash on Delivery
* View order history
* Track delivery in real time
* Rate food items

### 🏪 Shop Owner

* Create and manage a shop
* Add, edit, and delete food items
* Receive new orders
* Update order status
* Assign orders to nearby delivery personnel

### 🛵 Delivery Personnel

* Delivery personnel dashboard
* Receive delivery assignments
* Accept delivery assignments
* Share live location
* View delivery location on a map
* Complete delivery using OTP verification

## Technology Stack

### Frontend

* React.js
* Redux Toolkit
* React Router
* Tailwind CSS
* Axios
* Leaflet
* React-Leaflet
* Socket.IO Client
* Firebase Authentication

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT
* bcrypt
* Socket.IO
* Nodemailer
* Multer

### External Services

* Cloudinary
* Firebase Authentication
* Geoapify
* OpenStreetMap

## Project Structure

```text
FOOD-DELIVERY-FULLSTACK/
│
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middlewares/
│   ├── models/
│   ├── routes/
│   ├── socket.js
│   └── index.js
│
└── frontend/
    └── src/
        ├── components/
        ├── hooks/
        ├── pages/
        ├── redux/
        └── App.jsx
```

## Application Flow

1. The customer registers or logs in.
2. Shops and food items available in the customer's city are displayed.
3. The customer adds items to the cart and proceeds to checkout.
4. A delivery address is selected using the interactive map.
5. The customer places the order using Cash on Delivery.
6. The respective shop owner receives the order and updates its status.
7. When the order is ready for delivery, nearby available delivery personnel are notified.
8. A delivery person accepts the assignment and shares their live location.
9. The customer can track the delivery on the map.
10. The delivery is completed after OTP verification.

## Database

**MongoDB** is used as the primary database with **Mongoose** for data modelling.

### Main Models

* `User`
* `Shop`
* `Item`
* `Order`
* `DeliveryAssignment`

The `Order` model also contains embedded **shop-order** and **shop-order-item** information.

## Getting Started

Follow the steps below to run Feasto locally.

### Prerequisites

Make sure the following are installed on your system:

* Node.js
* npm
* MongoDB

### 1. Clone the Repository

```bash
git clone https://github.com/Tanya-Gupta23/FOOD-DELIVERY-FULLSTACK.git
cd FOOD-DELIVERY-FULLSTACK
```

### 2. Backend Setup

Navigate to the backend directory:

```bash
cd backend
npm install
```

Create a `.env` file inside the `backend` directory and add the required environment variables.

Start the backend server:

```bash
npm run dev
```

### 3. Frontend Setup

Open another terminal and navigate to the frontend directory:

```bash
cd frontend
npm install
```

Create the required frontend environment variables in the frontend `.env` file.

Start the frontend:

```bash
npm run dev
```

The application will be available on the local development URL provided by Vite.

## Environment Variables

The application requires environment variables for:

* MongoDB connection
* JWT authentication
* Cloudinary
* Firebase Authentication
* Geoapify
* Email service
* Frontend and backend server URLs

> **Important:** Do not commit `.env` files, API keys, passwords, or other sensitive credentials to the repository.

## Future Improvements

* Online payment integration
* Order cancellation and refund handling
* Admin dashboard
* Push notifications
* Enhanced ratings and reviews
* Automated testing

## Author

**Tanya Gupta**

MCA
Indira Gandhi Delhi Technological University for Women (IGDTUW)

## Project Context

Developed as part of the **Summer Internship on Full Stack Development with Gen-AI** at **Indira Gandhi Delhi Technological University for Women (IGDTUW)**.

