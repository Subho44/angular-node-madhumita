const express = require("express");
const dotenv = require('dotenv');
const cors = require('cors');
const User = require("./models/User");
const dbconnect = require("./config/db");
const authRoutes = require('./routes/authRoutes');
dotenv.config();
dbconnect();
User();
const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/auth',authRoutes);
app.get('/',(req,res)=>{
    res.send("api is working");
})
const port = process.env.PORT || 5600;

app.listen(port,(req,res)=>{
    console.log("server is running port 5600");
})