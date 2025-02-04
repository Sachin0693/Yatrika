const User= require("../models/user.js");
const Listing=require("../models/listing.js");
const Booking=require("../models/booking.js");
const Business=require("../models/business.js");

module.exports.signup=(req,res)=>{
    res.render("users/signup.ejs");
};

module.exports.signin=async(req,res)=>{
    try{
    let {username,email,password}=req.body;
    const newUser=new User({email,username});
    const regUser=await User.register(newUser,password);
    req.login(regUser,(err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","Welcome to Wanderlust!");
        res.redirect("/listings");
    })
    
} catch(e){
    req.flash("error","something went wrong");
    res.redirect("/signup");
}
};

module.exports.login=(req,res)=>{
    res.render("users/login.ejs");
};

module.exports.loggedin= async(req,res)=>{
    req.flash("success","You are logged in");
    console.log(req.body.username);
    let user= await User.find({username:`${req.body.username}`});
    let redirectUrl=res.locals.redirectUrl||`/${user[0]._id}/profile`;
    res.redirect(redirectUrl);
    };

module.exports.logout=(req,res,next)=>{
    req.logout((err)=>{
        if(err){
        return next(err);
        }
        req.flash("success"," logged out");
        res.redirect("/listings");
    })};

module.exports.profile=async(req,res)=>{
    let {id}=req.params;
    const allListings= await Listing.find({owner:{_id:`${id}`}})
    const allBusinesses=await Business.find({owner:{_id:`${id}`}})
    res.render("users/profile.ejs",{allListings, allBusinesses});
}

module.exports.bookings=async (req,res)=>{
    let {id}=req.params;
    const AllBookings=await Booking.find({owner:id});
    res.render("users/bookings.ejs",{AllBookings}); 
}

 module.exports.updateBuis=async (req,res)=>{
    let {id}=req.params;
    console.log(id)
    console.log(req.body)
  let newBusiness= await Business.findByIdAndUpdate(id,{...req.body});
 if(typeof req.file!=="undefined"){ 
    let url=req.file.path;
    let filename=req.file.filename;
    newBusiness.image={url,filename};
    await newBusiness.save();
}
   req.flash("success","Listing Updated");
      res.redirect(`/listings/${id}`);
     
};

module.exports.deleteBuis=module.exports.destroy=async(req,res)=>{
    let{id}=req.params;
   let business= await Business.findByIdAndDelete(id);
   console.log(business);
    res.redirect("/listings");
};

module.exports.createBuis=async (req,res)=>{
    console.log(req.file);
    let url=req.file.path;
    let filename=req.file.filename;
    let newBusiness=new Business(req.body);
    newBusiness.owner=req.user._id;
    newBusiness.image={url,filename};
        await newBusiness.save();
req.flash("success", "New Listing Created!");
res.redirect(`/${req.user._id}/profile`)
};