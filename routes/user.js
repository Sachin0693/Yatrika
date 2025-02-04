const express=require("express");
const router=express.Router();
const passport=require("passport");
const wrapAsync = require("../utils/wrapAsync.js");
const { saveRedirectUrl } = require("../middleware.js");
const { signup, signin, login, loggedin, logout ,profile, bookings, createBuis, showBuis, editBuis, updateBuis, deleteBuis} = require("../controllers/users.js");
const multer=require("multer");
const {storage}=require("../cloudConfig.js");
const upload=multer({storage});


router.get("/signup", signup);


router.post("/signup", 
    wrapAsync(signin));

//login

router.get("/login",login);

//loggedin

router.post(
    "/login",
    saveRedirectUrl ,
     passport.authenticate("local", {failureRedirect:"/login", failureFlash:true}) ,
    loggedin);

//logout

router.get("/logout",logout);

//profile
router
    .route("/:id/profile")
    .get(profile)
    // .post()
    .post( upload.single('image'),createBuis)

//all bookings
router
  .route("/:id/bookings")
   .get(bookings)

   
router
  .route("/:id")
  .put(upload.single('image'),updateBuis)
  .delete(deleteBuis)
   

module.exports=router;

