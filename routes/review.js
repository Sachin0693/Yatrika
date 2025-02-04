const express=require("express");
const router=express.Router({mergeParams:true});
const wrapAsync=require("../utils/wrapAsync.js");
const { validateReview, isLoggedIn, isReviewAuthor } = require("../middleware.js");
const { destroy, create } = require("../controllers/reviews.js");


router.post("/",
  isLoggedIn,
   validateReview,
    wrapAsync(create));

router.delete("/:reviewId",
  isReviewAuthor,
  wrapAsync(destroy));

module.exports=router;