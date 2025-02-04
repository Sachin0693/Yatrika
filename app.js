if(process.env.NODE_ENV!="production"){
    require("dotenv").config();
}

const express= require ("express");
const app=express();
const mongoose = require("mongoose");
const path=require("path");
const methodOverride=require("method-override");
const ejsMate=require("ejs-mate");
const ExpressError=require("./utils/ExpressError.js");
const session=require("express-session");
const MongoStore=require("connect-mongo");
const flash=require("connect-flash");
const nodemailer = require('nodemailer');
const passport=require("passport");
const LocalStrategy=require("passport-local");
const User=require("./models/user.js");

const listingRouter=require("./routes/listing.js");
const reviewRouter=require("./routes/review.js");
const userRouter=require("./routes/user.js");

const bodyParser = require('body-parser'); 
app.use(bodyParser.json());

const sosRoute = require('./routes/sosAlert.js');  
app.use('/sos-alert', sosRoute);  

main()
.then(()=>{
    console.log("connectionn extablished");
})
.catch((err)=>{console.log(err)});

async function main(){
    await  mongoose.connect('mongodb://127.0.0.1:27017/Wanderlust');
  }

app.set("view engine","ejs");
app.set("views", path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"public")));

// const store=MongoStore.create({
//     mongoUrl: "mongodb://localhost:27017",
// crypto:{
//     secret: process.env.SECRET
// },
// touchAfter: 24 *3600,
// });

// store.on("error", ()=>{
//     console.log("Error in mongo session store", err)
// });

const sessionOptions={
    // store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie:{
        expires: Date.now()+7*24*60*60*1000,
      maxAge:7*24*60*60*1000,
      httpOnly:true,
    }
};
process
app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    res.locals.currUser=req.user;
    next();
});

app.use("/listings",listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);

app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"Page Not Found!"));
})

app.use((err,req,res,next)=>{
    let{statusCode=500, message="something went wrong"}= err;
    res.status(statusCode).render("error.ejs", {err});
});
app.post("/sos-alert", async (req, res) => {
    const { latitude, longitude } = req.body;

    // Check if latitude and longitude are present
    if (!latitude || !longitude) {
        return res.status(400).json({ message: "Location data is missing" });
    }

    // Prepare the SOS alert message
    const message = `Emergency SOS Alert!\nLocation: Latitude: ${latitude}, Longitude: ${longitude}`;

    try {
        // Set up the transporter using Nodemailer
        let transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        // Send the email
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: "target-email@example.com",  // Replace with the recipient's email address
            subject: "Emergency SOS Alert",
            text: message,
        });

        // Send a response back indicating success
        res.status(200).json({ message: "SOS alert sent successfully" });
    } catch (error) {
        console.error("Error sending SOS alert:", error);
        res.status(500).json({ message: "Error sending SOS alert" });
    }
});

app.listen(3000,()=>{
    console.log("listening on port 3000");
})


module.exports = app;

