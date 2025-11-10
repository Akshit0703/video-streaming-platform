import dotenv from "dotenv"
import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

dotenv.config({
    path:'./env'
})

const connectDB = async () => {
    console.log(`${process.env.MONGODB_URI}/${DB_NAME}`);
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
        console.log(`MONGODB connected, DB host : ${connectionInstance.connection.host
        }`);
    }
    catch (error) {
        console.log("MONGO DB connection error", error);
    }
}

export default connectDB;