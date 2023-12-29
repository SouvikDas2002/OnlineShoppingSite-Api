const mongoose = require("mongoose");
const { boolean } = require("webidl-conversions");

const ProductSchema = new mongoose.Schema({
  title: {type: String,required: true,unique: true},
  desc:{type:String,required:true},
  img: { type: String, required: true, unique: true },
  category: { type: Array, required: true },
  size:{type:Array},
  color:{type:Array},
  price:{type:Number,required:true},
  inStock:{type:Boolean,default:true}
},
{timestamps:true}
);

module.exports=mongoose.model("Products",ProductSchema);