import express from "express";
import cors from 'cors';
import morgan from "morgan";
import User from './models/User.js'

const app = express();
app.use(cors({origin:true,Credential:true}));
app.use(express.json());
User();
app.use(morgan('dev'));
app.get('/',(_,res)=>res.json({status:'ok'}));

export default app;