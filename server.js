const express=require('express');
const app=express();
const mongoose=require("mongoose");
const dotenv=require("dotenv");
const userRoute=require("./routes/user")
const authRoute=require("./routes/auth")
const productRoute=require("./routes/product")
const cartRoute=require("./routes/cart")
const orderRoute=require("./routes/order")
app.use(express.json())

app.use(express.urlencoded({extended:true}));
app.use("/api/auth",authRoute);
app.use("/api/users",userRoute);
app.use("/api/products",productRoute);
app.use("/api/carts",cartRoute);
app.use("/api/orders",orderRoute);

dotenv.config();

mongoose.connect(process.env.MONGO_URL)
.then(()=>console.log("DB connection successfull"))
.catch(err=>
    {
        console.log(err)
    });




app.listen(process.env.PORT,(err)=>{
    if (err) throw err;
    console.log(`Server is running on port ${process.env.PORT}`);
});