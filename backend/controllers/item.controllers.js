import Item from "../models/item.model.js";
import Shop from "../models/shop.model.js";
import uploadOnCloudinary from "../utils/cloudinary.js";

export const addItem = async (req, res) => {
  try {
    const { name, category, price, foodType } = req.body;

    let image;

    if (req.file) {
      image = await uploadOnCloudinary(req.file.path);
    }

    // Logged-in owner ki shop
    const shop = await Shop.findOne({ owner: req.userId })
    
    if (!shop) {
      return res.status(404).json({
        message: "Shop not found"
      });
    }

    

    // CREATE
    const item = await Item.create({
      name,
      category,
      price,
      foodType,
      image,
      shop: shop._id


    });
    

    shop.items.push(item._id);
await shop.save();

    await shop.populate("owner")
    await shop.populate({
      path:"items",
      options:{sort:{updatedAt:-1}}
    });

    return res.status(201).json(shop);

  } catch (error) {
    console.log(error.response?.data);
    console.log(error.response?.data?.message);
    setLoading(false);
}
};

// EDIT
export const editItem = async (req, res) => {
  try {
    const { itemId } = req.params;
    const { name, category, price, foodType } = req.body;

    let image;

    if (req.file) {
      image = await uploadOnCloudinary(req.file.path);
    }

    const updateData = {
      name,
      category,
      price,
      foodType,
    };

    if (image) {
      updateData.image = image;
    }

    const item = await Item.findByIdAndUpdate(
      itemId,
      updateData,
      { returnDocument: "after" }
    );

    if (!item) {
      return res.status(404).json({
        message: "Item not found",
      });
    }
    const shop= await Shop.findOne({owner:req.userId}).populate({
      path:"items",
      options:{sort:{updatedAt:-1}}
    })

    await item.populate("shop");

    return res.status(200).json(shop);

  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

//Get Item By ID
export const getItemById = async (req, res) => {
  try {
    const { itemId } = req.params;

    const item = await Item.findById(itemId).populate("shop");

    if (!item) {
      return res.status(404).json({
        message: "Item not found",
      });
    }

    return res.status(200).json(item);

  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};


//Delete


export const deleteItem = async (req, res) => {
  try {
    const { itemId } = req.params;

    // Delete item
    const item = await Item.findByIdAndDelete(itemId);

    if (!item) {
      return res.status(404).json({
        message: "Item not found",
      });
    }

    // Logged-in owner's shop
    const shop = await Shop.findOne({ owner: req.userId });

    if (!shop) {
      return res.status(404).json({
        message: "Shop not found",
      });
    }

    // Remove item id from shop.items
    shop.items = shop.items.filter(
      (id) => id.toString() !== itemId
    );

    await shop.save();

    await shop.populate({
      path:"items",
      options:{sort:{updatedAt:-1}}
    });
    await shop.populate("owner", "-password");

    return res.status(200).json(shop);

  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const getItemByCity = async (req, res) => {
  try {
    const { city } = req.params;

    if (!city) {
      return res.status(400).json({
        message: "City is required",
      });
    }

    const shops = await Shop.find({
                city: { $regex: new RegExp(`^${city}$`, "i") }
            })
            .populate("owner", "-password")
            .populate({
                path: "items",
                options: {
                    sort: { updatedAt: -1 }
                }
            });

             if (shops.length === 0) {
    return res.status(200).json([]);
             }
    const shopIds= shops.map((shop)=>shop._id)
    const items= await Item.find({shop:{$in:shopIds}})
    return res.status(200).json(items)

             
  } catch (error) {
    console.log(error);
    res.status(500).json({
      
      message: `Get items by city error: ${error.message}`
    });
  }
};


export const getItemsByShop= async(req,res)=>{
  try {
    const {shopId}= req.params
    const shop=await Shop.findById(shopId).populate("items")
    if(!shop){
      return res.status(400).json("Shop not found")
    }
    return res.status(200).json({shop, 
      items:shop.items})

    
  } catch (error) {
    console.log(error);
    res.status(500).json({
      
      message: `Get items by shop error: ${error.message}`
    });
  }
}

export const searchItems= async (req, res)=>{
  try {
    const{query, city}=req.query
    if(!query || !city){
      return null
    }

    const shops = await Shop.find({
                city: { $regex: new RegExp(`^${city}$`, "i") }
            })
            .populate("items")
            if(!shops){
              return res.status(400).json({message:"shops not found"})
            }

            const shopIds= shops.map(s=>s._id)
            const items= await Item.find({
              shop:{$in: shopIds},
              $or:[
                {name:{$regex: query, $options:"i"}},
                {category:{$regex: query, $options:"i"}}
              ]
            }).populate("shop","name image")

            return res.status(200).json(items)

  } catch (error) {
    return res.status(500).json({
      
      message: `seartch items error: ${error.message}`
    });
    
  }
}


export const rating= async(req, res)=>{
    try {
        const {itemId, rating}= req.body
        if(!itemId || !rating){
          return res.status(400).json({message:"itemId and rating is required"})
        }
        if(rating<1 || rating>5){
          return res.status(400).json({message:"rating must be between 1 to 5"})
          
        }
        const item= await Item.findById(itemId)
        if(!item){
          return res.status(400).json({message:"item not found"})
        }

        const newCount=item.rating.count+1
        const newAvg= (item.rating.average*item.rating.count+rating)/newCount

        item.rating.count= newCount
        item.rating.average= newAvg
        await item.save()
        return res.status(200).json({rating: item.rating})


    } catch (error) {
      return res.status(500).json({
      
      message: `rating error: ${error.message}`
    });
        
    }
}