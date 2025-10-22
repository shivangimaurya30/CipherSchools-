import mongoose from "mongoose";

const mongoConnect=async()=>{
    try{
        const connectionUrl=await mongoose.connect(`${process.env.MONGODB_URL}/cipherstudio`)
        console.log('connected to database');
    }
    catch(error){
        console.log('mongodb connection failed!',error);
        process.exit(1)
    }
}

export default mongoConnect;