const express=require("express");
const router=express.Router();
const signUp=require("../controllers/auth/signUp");
const signIn =require("../controllers/auth/signin")
const logout=require("../controllers/auth/logout")


router.post("/signin",signIn);
router.post("/signup",signUp);
router.get("/logout",logout);

module.exports=router;