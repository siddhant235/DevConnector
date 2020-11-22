const mongoose=require("mongoose");
const config=require("config");
const db=config.get('mongoURI');
const connectDB=async()=>{
  try{
   await  mongoose.connect(db,{
       useNewUrlParser:true,
       useCreateIndex:true,
       useFindAndModify:false
   })
   console.log("MONGODB CONNECTED");
  }catch(err){
   console.log(err.message);
   //Exit processwith failure
   process.exit(1);
  }
}
module.exports=connectDB;