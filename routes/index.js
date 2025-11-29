const express=require('express');
const router=express.Router();
const isLoggedin = require('../middlewares/isLoggedin');
const productModel = require('../models/product-model');
const userModel = require('../models/user-model');

router.get("/",function(req,res){
    // let error=req.flash("error");
    res.render("index",{loggedin:false });
});

router.get("/shop",isLoggedin,async function(req,res){
    let products=await productModel.find();
    let success=req.flash("success") || '';
    res.render("shop",{products,success});   
});

router.get("/admin",isLoggedin,async function(req,res){
    let products=await productModel.find();
    let success=req.flash("success") || '';
    res.render("admin",{products,success});   
});

router.get("/cart",isLoggedin,async function(req,res){
    let user=await userModel.findOne({email:req.user.email});
    let cartProducts=await productModel.find({'_id': {$in: user.cart}});
    
    // Calculate dynamic totals with fallbacks
    let subtotal = 0;
    if (cartProducts && cartProducts.length > 0) {
        cartProducts.forEach(product => {
            subtotal += product.price || 0;
        });
    }
    let platformFee = 20;
    let totalMRP = subtotal * 1.6; 
    let totalAmount = subtotal + platformFee;
    
    let success=req.flash("success") || '';
    res.render("cart",{
        cartProducts: cartProducts || [],
        user: user || {},
        success,
        totalMRP,
        subtotal,
        platformFee,
        totalAmount
    });   
});

router.get("/addtocart/:id",isLoggedin,async function(req,res){
    let user=await userModel.findOne({email:req.user.email});
    user.cart.push(req.params.id);
    await user.save();
    req.flash("success","Added to cart successfully!");
    res.redirect("/shop");
});

router.get("/logout",isLoggedin,function(req,res){
    res.render("shop");
});

module.exports=router;
