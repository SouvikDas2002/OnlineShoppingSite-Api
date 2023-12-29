const Product = require("../models/Products");
const { verifyToken, verifyTokenAndAuthorization,verifyTokenAndAdmin } = require("./verify");

const router=require("express").Router();

// Create

router.post("/",verifyTokenAndAdmin,async(req,res)=>{
    const newProduct=new Product(req.body)

    try{
        const savedProduct=await newProduct.save();
        res.status(200).json(savedProduct);
    }catch(err){
        res.status(500).json(err)
    }
})

router.put("/:id",verifyTokenAndAdmin,async(req,res)=>{
    
    try{
        const updateProduct=await Product.findByIdAndUpdate(req.params.id,{
            $set:req.body,
        },{new:true});
        
        res.status(200).json(updateProduct);
    }catch(err){
        res.status(500).json(err)
    }
})
router.delete("/:id",verifyTokenAndAdmin,async(req,res)=>{
    try{
        await Product.findByIdAndDelete(req.params.id)
        res.status(200).json("Product has been deleted");
    }catch(err){
        res.status(500).json(err);
    }
})
// get Product by id
router.get("/find/:id",async(req,res)=>{
    try{
        const product=await Product.findById(req.params.id)
        res.status(200).json(product);
    }catch(err){
        res.status(500).json(err);
    }
})
// get all products
router.get("/",async(req,res)=>{
    const query=req.query.new;
    const qcategory=req.query.category;
    try{
        let products;
        if(query){
            products=await Product.find().sort({createdAt:-1}).limit(5)
        }else if(qcategory){
            products=await Product.find({category:{
                $in:[qcategory],
            }})
        }else{
            products = await Product.find();
        }
        res.status(200).json(products);
    }catch(err){
        res.status(500).json(err);
    }
})


module.exports=router;