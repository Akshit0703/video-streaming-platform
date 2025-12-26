import dotenv from "dotenv"
import mongoose from "mongoose";
import { DB_NAME } from "./constants.js";
import connectDB from "./db/index.js";
import { app } from "./app.js";
dotenv.config({
    path:'./env'
})


connectDB()
.then(()=> {
    app.listen ( process.env.PORT || 8000, ()=> {
        console.log(`Server is running at port : ${process.env.PORT}`);
    })
})
.catch((err)=> {
    console.log("Mongo DB connection failed");
});

// ;( async ()=> {               // this is a iffy is a instantly executing function, there is a semicolon in the front for cleaning purposes.
//     try {
//         await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
//     }
//     catch (error) {
//         console.log("Error : ", error);
//         throw err;
//     }
// }) ()   

