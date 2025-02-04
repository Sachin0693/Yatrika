const mongoose=require("mongoose");
const initData =require("./data.js");
const Listing=require("../models/listing.js");

main()
.then(()=>{
    console.log("connectionn extablished");
})
.catch((err)=>{console.log(err)});

async function main(){
    await  mongoose.connect('mongodb://127.0.0.1:27017/Wanderlust');
  }

const initDb=async()=>{
 await Listing.deleteMany({}); 
 initData.data=initData.data.map((obj)=>({...obj,owner:"66b7221baed345dd08a12a38"}));
 await Listing.insertMany(initData.data);
 console.log("data was initialised");  
}

initDb();