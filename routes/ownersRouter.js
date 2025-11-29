const express=require('express');
const router=express.Router();
const ownerModel=require("../models/owner-model");
const adminController=require("../controllers/authController")
const productModel=require("../models/product-model");

if(process.env.NODE_ENV==="development"){
    router.post("/create",async function(req,res){
        let owners=await ownerModel.find();
        if(owners.length>0){
            return res
                .status(503)
                .send("You dont have permission to create a new owner.");
        }

        let {fullname,email,password}=req.body;
        let createdOwner=await ownerModel.create({
            fullname,
            email,
            password,
        });
        res.status(201).send(createdOwner);  
    });
}

// router.get("/admin",function(req,res){
//     let success=req.flash("success");
//     res.render("createproducts.ejs",{success });
// });

router.get("/login",(req,res)=>{
    res.render("owner-login");
});

router.post("/login",adminController.loginAdmin);
// console.log(process.env.NODE_ENV);

function isOwner(req, res, next) {
    if (!req.session.isOwner) {
        req.flash("error", "Please login as admin first.");
        return res.redirect("/owners/login");
    }
    next();
}

router.get("/admin", isOwner, async (req, res) => {
    try {
        const products = await productModel.find();
        res.render("admin", { products });
    } catch (err) {
        console.log(err);
        req.flash("error", "Unable to load products!");
        res.redirect("/owners/login");
    }
});

router.get("/logout", (req, res) => {
    req.session.destroy(() => {
        res.redirect("/owners/login");
    });
});




module.exports=router;
