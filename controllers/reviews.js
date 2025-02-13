const Review=require("../models/review.js");
const Listing=require("../models/listing.js");
const Business = require("../models/business.js");

module.exports.create=async(req,res)=>{ 
    let {id}=req.params;
  let listing = await Listing.findById(id);
  if(listing==null){
    listing= await Business.findById(id);
  }
  console.log(listing);
  let newReview=new Review(req.body.review);
newReview.author=req.user._id;
  listing.reviews.push(newReview);
  await newReview.save();
  await listing.save();
  res.redirect(`/listings/${listing._id}`);
};

module.exports.destroy=async(req,res)=>{
    let{id, reviewId}=req.params;
    await Listing.findByIdAndUpdate(id,{pull:{reviews:reviewId}});
   await Review.findByIdAndDelete(reviewId);
   res.redirect(`/listings/${id}`);
};