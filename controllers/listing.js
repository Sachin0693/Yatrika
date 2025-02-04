const Listing=require("../models/listing.js");
const Booking=require("../models/booking.js");
const Business=require("../models/business.js");

 
module.exports.index=async (req,res)=>{

    const allListings=await Listing.find({});
    const allBusinesses=await Business.find({});
    res.render("listings/index.ejs",{allListings,allBusinesses});
};

module.exports.newform = (req,res)=>{
    
    res.render("listings/new.ejs");
};

module.exports.create = async (req,res)=>{
    let url=req.file.path;
    let filename=req.file.filename;
    let new1Listing=new Listing(req.body);
    new1Listing.owner=req.user._id;
    new1Listing.image={url,filename};
        await new1Listing.save();
req.flash("success", "New Listing Created!");
res.redirect("/listings");
};

module.exports.show = async(req,res)=>{
    let {id}=req.params;
   let listing=await Listing.findById(id).populate({path:"reviews",populate:{
    path:"author",
   }}).populate("owner");
   if(listing==null){
   listing=await Business.findById(id).populate({path:"reviews",populate:{
    path:"author",
   }}).populate("owner");
   if(!listing){
    req.flash("error", "Listing you requested does not exist!");
    req.redirect("/listings");
   }
   let business=listing
   res.render("listings/showBuis.ejs",{business});
   }
   res.render("listings/show.ejs",{listing});
};

module.exports.edit = async (req,res)=>{
    let {id}=req.params;
    let listing=await Listing.findById(id);
    if(listing==null){
        listing=await Business.findById(id);
        let orgImg= listing.image.url;
        orgImg=orgImg.replace("/upload","/upload/w_250")
        let business=listing
         res.render("listings/updateBuis.ejs",{business,orgImg});
    }
    else if(!listing){
        res.flash("error","listing dos not exist");
        res.redirect("/listings");
    }
   let orgImg= listing.image.url;
    orgImg=orgImg.replace("/upload","/upload/w_250")
     res.render("listings/update.ejs",{listing,orgImg});
 };

module.exports.update = async (req,res)=>{
    let {id}=req.params;
  let new1Listing= await Listing.findByIdAndUpdate(id,{...req.body});
 if(typeof req.file!=="undefined"){ 
    let url=req.file.path; 
    let filename=req.file.filename;
    new1Listing.image={url,filename};
    await new1Listing.save();
}
   req.flash("success","Listing Updated");
       res.redirect(`/listings/${id}`);
};

module.exports.searchListing=async(req,res)=>{
    let scity=req.query.city
    let allListings= await Listing.find({city:scity});
    let allBusinesses=await Business.find({city:scity});
    if(allListings!=""||allBusinesses!=""){
         res.render("listings/search.ejs",{allListings,allBusinesses})
    }
   else{
    req.flash("error","SORRY :( ,NO MATCHES FOUND")
    res.redirect("/listings")
   }
}

module.exports.searchListingbyId=async(req,res)=>{
    let id=req.params.id
    let listing= await Listing.findById(id);
    let allListings= []
    let allBusinesses=await Business.find({city:(listing.city)});
    if(allBusinesses!=""){
        res.render("listings/search.ejs",{allListings,allBusinesses})
   }
  else{
   req.flash("error","SORRY :( ,NO MATCHES FOUND")
   res.redirect("/listings")
  }
}

module.exports.destroy=async(req,res)=>{
    let{id}=req.params;
   let listing= await Listing.findByIdAndDelete(id);
   console.log(listing);
    res.redirect("/listings");
};

module.exports.book=async (req,res)=>{
    let {id}=req.params;
    let listing=await Listing.findById(id);
    res.render("listings/book.ejs", {listing});
};

module.exports.newBuis=async(req,res)=>{
    res.render("listings/newBuis.ejs");
}

module.exports.ConfirmBooking=async(req,res)=>{
    let {id}=req.params;
    let listing=await Listing.findById(id);
    let newBooking=new Booking(req.body) ;
    newBooking.owner=req.user._id;
    newBooking.bookedproperty=id;
    newBooking.Price=listing.price;
    newBooking.title=listing.title;
    newBooking.image.url=listing.image.url;
    await newBooking.save();
    req.flash("success","booked successfully");
    res.render("listings/bookCom.ejs",{listing});
};