import mongoose from "mongoose"
import dns from "dns"
dns.setServers(["1.1.1.1", "8.8.8.8"]);


const connectDB = async () => {
    try {
        console.log("URI:", process.env.MONGODB_URL)

        await mongoose.connect(process.env.MONGODB_URL)

        console.log("DB connected")
    } catch (error) {
        console.log("DB ERROR:", error.message)
    }
}

export default connectDB