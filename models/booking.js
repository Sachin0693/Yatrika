
const { number, required, ref } = require("joi");
const mongoose = require("mongoose");
const Schema=mongoose.Schema;

const bookingSchema= new Schema({
    checkin:{
        type:Date,
        required: true,
    },
    checkout:{
        type:Date,
        required:true,
    },
    Price:{
        type:Number,
       
        
    },
    Name:{
        type:String,
        required:true,
    },
    
    contact:{
      type:Number,
      required:true,

    },

    email:{
        type:String,
        required:true,
    },
    
    owner:{
        type: Schema.Types.ObjectId,
        ref:"User",
    },

    bookedproperty:{
        type:Schema.Types.ObjectId,
        ref:"Listing",
    },

    title:{
        type:String,
    },

    image:{
        url:String ,
    },

    createdAt:{
        type:Date,
        default:Date.now(),
    },
     
});

const Booking=mongoose.model("Booking",bookingSchema);
module.exports=Booking;