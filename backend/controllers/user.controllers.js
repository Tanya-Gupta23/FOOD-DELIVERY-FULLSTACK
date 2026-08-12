import User from "../models/user.model.js";

export const getCurrentUser = async (req, res) => {
    try {
        const user = await User.findById(req.userId).select("-password");

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        res.status(200).json(user);

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

export const updateUserLocation=async (req, res)=>{
    try {
        const {lat, lon}= req.body
        const user=await User.findByIdAndUpdate(req.userId, {
            location:{
                type:'Point',
                coordinates:[lon, lat]
            }
        }, { returnDocument: "after" })

        return res. status(200).json({message:'location updated'})

        
    } catch (error) {
        return res. status(200).json({message:'location update error'})
    }
}

