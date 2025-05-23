import express from 'express';
import mongoose from 'mongoose';
import dotenv from "dotenv";
import userRouter from "./api/routes/user-routes.js"
import authRouter from "./api/routes/auth-routes.js"
import listingRouter from "./api/routes/listing-routes.js";
import cookieParser from 'cookie-parser';
import cors from 'cors';
dotenv.config();

mongoose.connect(process.env.MONGO).then(()=>{
    console.log("connected to database");
}).catch((err) => {
    console.log(err);
}); 


const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin:"https://gruham-theta.vercel.app", credentials: true }));

app.listen(5000 , ()=>{
    console.log("connected to 5000");
});

app.use("/api/user" , userRouter);
app.use("/api/auth" , authRouter);
app.use("/api/listing" , listingRouter);

//middlewares
app.use((err , req , res , next)=>{
    const statuscode = err.statusCode || 500;
    const message = err.message ||"Internal Server Error";
    res.status(statuscode).json({
        message ,
        statuscode ,
        success:false,
    });
})
