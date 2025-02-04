const mongoose = require("mongoose");
const Schema=mongoose.Schema;
const Review=require("./review.js");

const businessSchema= new Schema({
    title:{
        type:String,
        required: true,
    },
    description:{
        type:String
    },
    image:{
     url:String,
     filename:String,
     
    },
    contact:{
        type: Number,
        required: true,
    },
    location:{
        type:String,
        required:true,
    },
    city:{
        type:String,
        required:true,
    },
    reviews:[
        {
            type: Schema.Types.ObjectId,
            ref:"Review",
        }
    ],
    owner:{
        type: Schema.Types.ObjectId,
        ref:"User",
    },
});


businessSchema.post("findOneAndDelete", async (business)=>{
    if(business){
        await Review.deleteMany({reviews:{$in:business.reviews}});
    }

});

const Business=mongoose.model("Business",businessSchema);
module.exports=Business;