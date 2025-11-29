const userModel=require("../models/user-model");
const ownerModel=require("../models/owner-model");
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');
const generateToken=require("../utils/generateToken");


module.exports.registerUser=async function(req,res){
    try{
        let{fullname,email,password}=req.body;

        let user=await userModel.findOne({email:email});
        if(user){
            req.flash("error", "Account already exists! Please login.");
            return res.redirect("/");
        }


        bcrypt.genSalt(10,function(err,salt){
            bcrypt.hash(password,salt,async function(err,hash){
                if(err) return res.send(err.message);
                else{
                    let user=await userModel.create({
                        fullname,
                        email,
                        password:hash,
                    });
                    let token=generateToken(user);
                    res.cookie("token",token);
                    req.flash("success","Registration successfully you can login now!!!");
                    return res.redirect("/");
                }
            })
        })
    }catch(err){
        res.send(err.message);
    }    
}

module.exports.loginUser=async function(req,res){
    let {email,password}=req.body;
    let user=await userModel.findOne({email:email});
    if(!user) return res.send("email or password is invalid.");

    bcrypt.compare(password,user.password,function(err,result){
        if(result){
            let token=generateToken(user);
            res.cookie("token",token);
            return res.redirect("/shop");
        }else{
            return res.send("email or password is invalid.");
        }
    });
};

module.exports.logout=async function(req,res){
    res.cookie("token","",{
        expires:new Date(0),
    });
    // res.send("You are logged out successfully.");
    res.redirect("/");
}

module.exports.loginAdmin=async function(req,res){
    const {email,password}=req.body;
    try{
        const owner=await ownerModel.findOne({email:email});
        if(!owner || owner.password!==password){
            req.flash("error","Invalid admin email or password!!");
            return res.redirect("/owners/login");
        }

        req.session.isOwner=true;
        req.session.ownerId=owner._id;

        req.flash("success","welcome admin!!");
        return res.redirect("/owners/admin");

    }catch(err){
        console.log(err);
        req.flash("error","Something went wrong.");
        return res.redirect("/owners/login");
    }
};