const User = require("../models/user");
const { verifyToken, verifyTokenAndAuthorization,verifyTokenAndAdmin } = require("./verify");

const router=require("express").Router();

router.put("/:id",verifyTokenAndAuthorization,async(req,res)=>{
    if(req.body.pass){
       req.body.pass=CryptoJS.AES.encrypt(req.body.pass,process.env.PASS_SEC).toString()
    }
    try{
        const updateuser=await User.findByIdAndUpdate(req.params.id,{
            $set:req.body,
        },{new:true});
        
        res.status(200).json(updateuser)
    }catch(err){
        res.status(500).json(err)
    }
})
router.delete("/:id",verifyTokenAndAuthorization,async(req,res)=>{
    try{
        await User.findByIdAndDelete(req.params.id)
        res.status(200).json("User has been deleted");
    }catch(err){
        res.status(500).json(err);
    }
})
// get user by id
router.get("/find/:id",verifyTokenAndAdmin,async(req,res)=>{
    try{
        const user=await User.findById(req.params.id)
        const {pass,...others}=user._doc;
        res.status(200).json(others);
    }catch(err){
        res.status(500).json(err);
    }
})
// get all users
router.get("/",verifyTokenAndAdmin,async(req,res)=>{
    const query=req.query.new
    try{
        const users=query ? await User.find().sort({_id:-1}).limit(1): await User.find();
        res.status(200).json(users);
    }catch(err){
        res.status(500).json(err);
    }
})

// Get user stats

router.get("/stats",verifyTokenAndAdmin,async(req,res)=>{
    const date=new Date();
    const lastYear=new Date(date.setFullYear(date.getFullYear()-1));

    try{
        const data=await User.aggregate([
            {$match:{createdAt:{$gte:lastYear}}},
            {
                $project:{
                    month:{$month:"$createdAt"},
                },
            },
            {
                $group: {
                  _id: "$month",
                  total: { $sum: 1 },
                },
              },
        ])
        res.status(200).json(data);
    }catch(err){
        res.status(500).json(err);
    }
})

module.exports=router;