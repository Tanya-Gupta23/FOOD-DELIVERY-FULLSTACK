import DeliveryAssignment from "../models/deliveryAssignment.model.js";
import Order from "../models/order.model.js"
import Shop from "../models/shop.model.js"
import User from "../models/user.model.js";
import { sendDeliveryOtpMail } from "../utils/mail.js";

export const placeOrder = async (req, res) => {
    try {
        //bringing things from checkout page
        //orderModel
        const { cartItems, paymentMethod, deliveryAddress, totalAmount } = req.body
        // Check if the cart contains any items
        if (cartItems.length == 0 || !cartItems) {
            return res.status(400).json({ message: "Cart is Empty" })
        }
        //checking del addresss
        if (!deliveryAddress.text || !deliveryAddress.latitude || !deliveryAddress.longitude) {
            return res.status(400).json({ message: "Send Complete Delivery Address" })
        }

        //items can be ordered from 2 different shops..so chhose the items for that particular shop
        //grouping items according to shops
        //object
        const groupItemsByShop = {}//values are stored as key value , keys are shop id and values are items ordered from that shop
        // Key = Shop ID
        // Value = Array of items belonging to that shop
        cartItems.forEach(item => {
            const shopId = item.shop
            if (!groupItemsByShop[shopId]) {
                groupItemsByShop[shopId] = [] //that is we made the key of that shop id
            }
            groupItemsByShop[shopId].push(item)

        });

        //creating a shop Orders
        //How many shop orders will create?? Number of keys in groupItemsByShop
        //Finding Owner
        const shopOrders = await Promise.all(Object.keys(groupItemsByShop).map(async (shopId) => {//we get only keys i.e. only shop ids
            const shop = await Shop.findById(shopId).populate("owner")
            if (!shop) {
                return res.status(400).json({ message: "Shop not found" })
            }
            //Finding Items
            const items = groupItemsByShop[shopId]
            //finding the subtotal 
            const subtotal = items.reduce((sum, i) => sum + Number(i.price) * Number(i.quantity), 0)
            //return shopOrder
            return {
                shop: shop._id,
                owner: shop.owner,
                subtotal,
                shopOrderItems: items.map((i) => (
                    {
                        item: i.id,
                        price: i.price,
                        quantity: i.quantity,
                        name: i.name
                    }))


            }

        }))

        //Creating Order
        //BY COD
        const newOrder = await Order.create({
            user: req.userId,
            paymentMethod,
            deliveryAddress,
            totalAmount,
            shopOrders
        })
        await newOrder.populate("shopOrders.shopOrderItems.item", "name image price ")
        await newOrder.populate("shopOrders.shop", "name socketId")
        await newOrder.populate("user", "name email mobile")


        //socket:
        const io = req.app.get('io')

        if (io) {
            newOrder.shopOrders.forEach(shopOrder => {
                const ownerSocketId = shopOrder.owner.socketId
                if (ownerSocketId) {
                    io.to(ownerSocketId).emit('newOrder', {
                        _id: newOrder._id,
                        paymentMethod: newOrder.paymentMethod,
                        user: newOrder.user,
                        shopOrders: shopOrder,
                        createdAt: newOrder.createdAt,
                        deliveryAddress: newOrder.deliveryAddress

                    })
                }


            })
        }


        return res.status(201).json(newOrder)



    } catch (error) {
        return res.status(500).json({ message: `Place Order Error ${error}` })

    }
}

export const getMyOrders = async (req, res) => {
    try {
        const user = await User.findById(req.userId)
        if (user.role == "user") {
            const orders = await Order.find({ user: req.userId })// we will ger by isAuth middle ware
                .sort({ createdAt: -1 })
                .populate("shopOrders.shop", "name")
                .populate("shopOrders.owner", "name email mobile")
                .populate("shopOrders.shopOrderItems.item", "name image price")
                .populate("shopOrders.assignedDeliveryBoy", "fullName mobile")

            return res.status(200).json(orders)
        }
        else if (user.role == "owner") {
            const orders = await Order.find({ "shopOrders.owner": req.userId })// we will ger by isAuth middle ware
                .sort({ createdAt: -1 })
                .populate("shopOrders.shop", "name")
                .populate("user")
                .populate("shopOrders.shopOrderItems.item", "name image price")
                .populate("shopOrders.assignedDeliveryBoy", "fullName mobile")

            const filteredOrder = orders.map((order => ({
                _id: order._id,
                paymentMethod: order.paymentMethod,
                user: order.user,
                shopOrders: order.shopOrders.find(o => o.owner._id == req.userId),
                createdAt: order.createdAt,
                deliveryAddress: order.deliveryAddress

            })))
            return res.status(200).json(filteredOrder)
        }
    } catch (error) {
        return res.status(500).json({ message: `Get user Order Error ${error}` })
    }
}


// Controller to update the status of a shop order

// Find the shop order that belongs to the shopId received in the request params
export const updateOrderStatus = async (req, res) => {
    try {
        const { orderId, shopId } = req.params
        const { status } = req.body
        const order = await Order.findById(orderId)

        const shopOrder = order.shopOrders.find(o => o.shop == shopId)
        if (!shopOrder) {
            return res.status(400).json({ message: "shop order not found" })
        }
        shopOrder.status = status

        // the data which we will send: payload
        let deliveryBoysPayload = []

        if (status == "out for delivery" && !shopOrder.assignment) {
            const { longitude, latitude } = order.deliveryAddress
            //it will find all the delivery boys 5km away from the order location
            const nearByDeliveryBoys = await User.find({
                role: "deliveryBoy",
                location: {
                    $near: {
                        $geometry: { type: "Point", coordinates: [Number(longitude), Number(latitude)] },
                        $maxDistance: 5000  //5km= 5000m
                    }
                }
            })
            //now filtering all the nearBY del boys who are free at that time

            const nearByIds = nearByDeliveryBoys.map(b => b._id)//ids of all the nearby del boys
            const busyIds = await DeliveryAssignment.find({
                assignedTo: { $in: nearByIds },// if there is any nearby id in busy ids then those id we dont want to have
                status: { $nin: ["broadcasted", "completed"] }// and the busy del boys status must not in["broadcasted", "completed"]
            }).distinct("assignedTo")

            const busyIdSet = new Set(busyIds.map(id => String(id)))
            const availableBoys = nearByDeliveryBoys.filter(b => !busyIdSet.has(String(b._id)))

            const candidates = availableBoys.map(b => b._id)

            if (candidates.length == 0) {
                await order.save()
                return res.json({
                    message: "Order status updated but there is no delivery boy available "
                })
            }

            //model
            const deliveryAssignment = await DeliveryAssignment.create({
                order: order._id,
                shop: shopOrder.shop,
                shopOrderId: shopOrder._id,
                broadcastedTo: candidates,
                status: "broadcasted"
            })
            shopOrder.assignedDeliveryBoy = deliveryAssignment.assignedTo
            shopOrder.assignment = deliveryAssignment._id
            console.log(availableBoys[0]);
            deliveryBoysPayload = availableBoys.map(b => ({
                id: b._id,
                fullName: b.fullName,
                longitude: b.location.coordinates[0],
                latitude: b.location.coordinates[1],
                mobile: b.mobile
            }))

            await deliveryAssignment.populate("order")
            await deliveryAssignment.populate("shop")

            const io = req.app.get('io')
            if (io) {
                availableBoys.forEach(boy => {
                    const boySocketId = boy.socketId
                    if (boySocketId) {
                        io.to(boySocketId).emit('new-assignment', {
                            sentTo: boy._id,
                            assignmentId: deliveryAssignment._id,
                            orderId: deliveryAssignment.order._id,
                            shopName: deliveryAssignment.shop.name,
                            deliveryAddress: deliveryAssignment.order.deliveryAddress,
                            items: deliveryAssignment.order.shopOrders.find(so => so._id.equals(deliveryAssignment.shopOrderId)).shopOrderItems || [],
                            subtotal: deliveryAssignment.order.shopOrders.find(so => so._id.equals(deliveryAssignment.shopOrderId)).subtotal || []
                        })
                    }

                })
            }






        }
        await shopOrder.save()
        await order.save()
        const updatedShopOrder = order.shopOrders.find(o => o.shop == shopId)

        await order.populate("shopOrders.shop", "name")
        await order.populate("shopOrders.assignedDeliveryBoy", "fullName email mobile")
        await order.populate("user", "socketId")


        const io = req.app.get('io')
        if (io) {
            const userSocketId = order.user.socketId
            if (userSocketId) {
                io.to(userSocketId).emit('update-status', {
                    orderId: order._id,
                    shopId: updatedShopOrder.shop._id,
                    status: updatedShopOrder.status,
                    userId: order.user._id

                })
            }

        }



        return res.status(200).json({
            shopOrder: updatedShopOrder,
            assignedDeliveryBoy: updatedShopOrder?.assignedDeliveryBoy,
            availableBoys: deliveryBoysPayload,
            assignment: updatedShopOrder?.assignment?._id

        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: ` Order Status Error ${error}` })

    }
}


export const getDeliveryBoyAssignment = async (req, res) => {
    try {
        const deliveryBoyId = req.userId
        const assignments = await DeliveryAssignment.find({
            broadcastedTo: deliveryBoyId,
            status: "broadcasted"
        })
            .populate("order")
            .populate("shop")

        const formatted = assignments.map(a => ({
            assignmentId: a._id,
            orderId: a.order._id,
            shopName: a.shop.name,
            deliveryAddress: a.order.deliveryAddress,
            items: a.order.shopOrders.find(so => so._id.equals(a.shopOrderId)).shopOrderItems || [],
            subtotal: a.order.shopOrders.find(so => so._id.equals(a.shopOrderId)).subtotal || []


        }))
        return res.status(200).json(formatted)
    } catch (error) {
        return res.status(500).json({ message: ` Get Assignment error ${error}` })

    }
}


export const acceptOrder = async (req, res) => {
    try {
        const { assignmentId } = req.params
        const assignment = await DeliveryAssignment.findById(assignmentId)
        if (!assignment) {
            return res.status(400).json({ message: "assignment not found" })

        }
        if (assignment.status !== "broadcasted") {
            return res.status(400).json({ message: "assignment is expired" })

        }
        const alreadyAssigned = await DeliveryAssignment.findOne({
            assignedTo: req.userId,
            status: { $nin: ["broadcasted", "completed"] }
        })

        if (alreadyAssigned) {
            return res.status(400).json({ message: "You are already assigned to another order" })
        }

        assignment.assignedTo = req.userId
        assignment.status = "assigned"
        assignment.acceptedAt = new Date()
        await assignment.save()

        //finding the order
        const order = await Order.findById(assignment.order)
        if (!order) {
            return res.status(400).json({ message: "Order not found" })
        }

        const shopOrder = order.shopOrders.find(so => so._id.equals(assignment.shopOrderId))
        if (!shopOrder) {
            return res.status(400).json({
                message: "Shop order not found"
            });
        }
        shopOrder.assignedDeliveryBoy = req.userId
        await order.save()
        return res.status(200).json({
            message: "order accepted"
        })

        console.log("Assignment:", assignment);
        console.log("Assignment Status:", assignment.status);
        console.log("Already Assigned:", alreadyAssigned);
        console.log("Order:", order);
        console.log("ShopOrder:", shopOrder);

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: error.message
        });
    }
}

//controller for getting the current order of delivery boy
export const getCurrentOrder = async (req, res) => {
    try {
        const assignment = await DeliveryAssignment.findOne({
            assignedTo: req.userId,
            status: 'assigned'
        })
            .populate("shop", "name")
            .populate("assignedTo", "fullName email mobile location")
            .populate({
                path: "order",
                populate: {
                    path: "user",
                    select: "fullName email mobile location"
                }
            })

        if (!assignment) {
            return res.status(400).json({
                message: "Assignment not found"
            })
        }

        if (!assignment.order) {
            return res.status(400).json({
                message: "order not found"
            })
        }
        const shopOrder = assignment.order.shopOrders.find(so => String(so._id) == String(assignment.shopOrderId))

        if (!shopOrder) {
            return res.status(400).json({
                message: "shopOrder not found"
            })

        }

        let deliveryBoyLocation = { lat: null, lon: null }
        if (assignment.assignedTo.location.coordinates.length == 2) {
            deliveryBoyLocation.lat = assignment.assignedTo.location.coordinates[1]
            deliveryBoyLocation.lon = assignment.assignedTo.location.coordinates[0]
        }

        let customerLocation = { lat: null, lon: null }
        if (assignment.order.deliveryAddress) {
            customerLocation.lat = assignment.order.deliveryAddress.latitude
            customerLocation.lon = assignment.order.deliveryAddress.longitude
        }

        return res.status(200).json({
            _id: assignment.order._id,
            user: assignment.order.user,
            shopOrder,
            deliveryAddress: assignment.order.deliveryAddress,
            customerLocation,
            deliveryBoyLocation
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: error.message
        });

    }
}


export const getOrderById = async (req, res) => {
    try {
        const { orderId } = req.params
        const order = await Order.findById(orderId)
            .populate("user")
            .populate({
                path: "shopOrders.shop",
                model: "Shop"
            })
            .populate({
                path: "shopOrders.assignedDeliveryBoy",
                model: "User"
            })
            .populate({
                path: "shopOrders.shopOrderItems.item",
                model: "Item"
            })
            .lean()

        if (!order) {
            return res.status(400).json({ message: "Order not found" })
        }
        return res.status(200).json(order)
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: error.message
        });

    }
}

export const sendDeliveryOtp = async (req, res) => {
    try {
        const { orderId, shopOrderId } = req.body
        const order = await Order.findById(orderId).populate("user")
        const shopOrder = order.shopOrders.id(shopOrderId)
        if (!order || !shopOrder) {
            return res.status(400).json({ message: "Enter valid order/ shopOrderid" })
        }
        const otp = Math.floor(1000 + Math.random() * 9000).toString()//6dig
        shopOrder.deliveryOtp = otp
        shopOrder.otpExpires = Date.now() + 5 * 60 * 1000
        await order.save()
        await sendDeliveryOtpMail(order.user, otp)
        return res.status(200).json({ message: `OTP sent successfully ${order?.user.fullName}` })


    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: error.message
        });

    }
}

export const verifyDeliveryOtp = async (req, res) => {
    try {
        const { orderId, shopOrderId, otp } = req.body
        const order = await Order.findById(orderId).populate("user")
        const shopOrder = order.shopOrders.id(shopOrderId)
        if (!order || !shopOrder) {
            return res.status(400).json({ message: "Enter valid order/ shopOrderid" })
        }

        if (shopOrder.deliveryOtp != otp || !shopOrder.otpExpires || shopOrder.otpExpires < Date.now()) {
            return res.status(400).json({ message: "Invalid/Expired OTP" })
        }

        shopOrder.status = "delivered"
        shopOrder.deliveredAt = Date.now()
        await order.save()

        await DeliveryAssignment.deleteOne({
            shopOrderId: shopOrder._id,
            order: order._id,
            assignedTo: shopOrder.assignedDeliveryBoy
        })

        return res.status(200).json({ message: "Order Delivered Successfully" })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: error.message
        });

    }
}
