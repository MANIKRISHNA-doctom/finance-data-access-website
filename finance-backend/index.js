import dotenv from 'dotenv';
dotenv.config();
import cookieParser from 'cookie-parser';
import express from 'express';
import cors from "cors";
import user_route from './routes/user_route.js';
import record_route from './routes/record_route.js';
import dashboard_router from './routes/dashboard.js';
const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: "https://finance-data-access-backend.vercel.app",
  credentials: true
}));
const port = process.env.PORT || 5000; 
app.use('/user',user_route);
app.use('/user_records',record_route);
app.use('/user_dashboard',dashboard_router);
app.get('/',(req,res)=>{
    res.status(200).send("Welcome to the Finance Management API home page");
})
app.listen(port,()=>{
    console.log(`server is listening to port ${port}`);
});


