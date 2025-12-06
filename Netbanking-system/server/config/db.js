const mongoose = require("mongoose");


const dbconnect =   async()=>{
   try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("mongodb connected");
   }
   catch(err) {
    console.error(err);
   }

}

module.exports = dbconnect;

