const express=require("express");
const router=express.Router();
const wrapAsync=require("../utils/wrapAsync.js");
const {isLoggedIn, isOwner, validateListing}=require("../middleware.js");
const { index, create, newform, show, edit, update, destroy, book, ConfirmBooking, newBuis, searchListing, searchListingbyId } = require("../controllers/listing.js");
const multer=require("multer");
const {storage}=require("../cloudConfig.js");
const upload=multer({storage});

//Index Route
router
  .route("/")
  .get( wrapAsync(index))
  .post(//create route
    isLoggedIn,
   // validateListing, 
    upload.single('image'),
    wrapAsync (create)
  );

//new listing route
router.get("/new-property",isLoggedIn, newform);


//new buisness route
router.get("/new-buisness", isLoggedIn,newBuis);


//search route
router.get("/search",searchListing)
router.get("/search/:id",searchListingbyId)

  router
     .route("/:id")
     .get( wrapAsync(show))//Show Route
     .post(ConfirmBooking) //confirm booking
     .put( //update route
        isLoggedIn,
        isOwner,
        upload.single('image'),
       // validateListing,
        wrapAsync (update))
    .delete( //Delete listing
    isLoggedIn,
    isOwner,
    wrapAsync (destroy));

//edit route
router.get("/:id/edit",
    isLoggedIn,
    isOwner,
    wrapAsync(edit));

//book route
router
     .route("/:id/book")
     .get(isLoggedIn,book);

module.exports=router;