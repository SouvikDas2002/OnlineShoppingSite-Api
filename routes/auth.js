const router=require('express').Router();
const User=require("../models/user")
const CryptoJS=require("crypto-js")
const jwt=require("jsonwebtoken");

// REGISTER
router.post("/register",async(req,res)=>{
    const newUser=new User({
        username:req.body.username,
        email:req.body.email,
        pass:CryptoJS.AES.encrypt(req.body.pass,process.env.PASS_SEC)
    });
    try{
   const savedUser=await newUser.save();
   console.log(savedUser);
    }catch(err){
        res.status(409).json({message:err})
    }
});

// LOGIN 

router.post("/login",async(req,res)=>{
    try{
    const user=await User.findOne({username:req.body.username});
    !user && res.status(401).json("wrooong user");
    const hanshedPassword=CryptoJS.AES.decrypt(user.pass,process.env.PASS_SEC);
    const password=hanshedPassword.toString(CryptoJS.enc.Utf8);

    if(password!=req.body.pass)
    res.status(401).json("wrong password");

    const accessToken=jwt.sign({
        id:user._id,
        isAdmin:user.isAdmin,
    },process.env.JWT_SEC,{expiresIn:"2d"})

    const { pass,...others}=user._doc;
        res.status(200).json({...others,accessToken});
    }catch(err){
        res.status(500).json(err);
    }
})



module.exports=router;