const express=require("express");
const router=express.Router();
const signUp=require("../controllers/auth/signUp");
const signIn =require("../controllers/auth/signin")
const logout=require("../controllers/auth/logout")
const verifyMe=require("../controllers/auth/me");


router.post("/signin",signIn);
router.post("/signup",signUp);
router.get("/logout",logout);
router.get("/me",verifyMe)

module.exports=router;