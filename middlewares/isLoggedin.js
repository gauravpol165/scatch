// //this file is for like if user is not logged in then then it should not open other pages
// const jwt=require('jsonwebtoken');
// const userModel=require("../models/user-model");

// module.exports=async function(req,res,next){
//     if(!req.cookie.token || !req.cookies.token){
//         req.flash("error","you need to login first");
//         return res.redirect("/");
//     }

//     try{
//         let decoded=jwt.verify(req.cookies.token,process.env.JWT_KEY);
//         let user=await userModel
//             .findOne({email:decoded.email})
//             .select("-password");

//         req.user=user;    
//         next();
//     }catch(err){
//         req.flash("error","Something went wrong.");
//         res.redirect("/");
//     }
// };
const jwt = require('jsonwebtoken');
const userModel = require("../models/user-model");

module.exports = async function(req, res, next) {
    try {

        // Check if cookie exists safely
        if (!req.cookies || !req.cookies.token) {
            req.flash("error", "You need to login first!");
            return res.redirect("/");
        }

        let decoded = jwt.verify(req.cookies.token, process.env.JWT_KEY);

        let user = await userModel.findOne({ email: decoded.email }).select("-password");

        if (!user) {
            req.flash("error", "User not found!");
            return res.redirect("/");
        }

        req.user = user;
        next();

    } catch (err) {
        req.flash("error", "Session expired or invalid token!");
        return res.redirect("/");
    }
};
