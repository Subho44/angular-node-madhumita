import express from "express";
import cors from 'cors';
import morgan from "morgan";


const app = express();
app.use(cors({origin:true,Credential:true}));
app.use(express.json());
app.use(morgan('dev'));
app.get('/',(_,res)=>res.json({status:'ok'}));

export default app;