const mongoose=require('mongoose')

// mongoose.connect("mongoodb://127.0.0.1:27017/scatch");

const productSchema=mongoose.Schema({
    image:Buffer,
    name:String,
    price:Number,
    discount:{
        type:Number,
        default:0,
    },
    bgcolor:String,
    panelcolor:String,
    textcolor:String,
});

module.exports=mongoose.model("product",productSchema);