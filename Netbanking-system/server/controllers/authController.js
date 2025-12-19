const User = require('../models/User');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Otp = require("../models/Otp");
const transporter = require("../config/mailer");

function genotp() {
    return String(Math.floor(100000 + Math.random()*900000));
}

//send otp
exports.sendOtp = async(req,res)=>{
    const {email} = req.body;
    try {
        const otp =genotp();
        const otpHash = await bcrypt.hash(otp,10);
        const expiresAt =new Date(Date.now() + 5 * 60 *1000);

        await Otp.findByIdAndUpdate(
            {email},
            {otpHash,expiresAt,attemptsLeft:5},
            {upsert:true, new:true}
        );

        await transporter.sendMail({
            from:process.env.EMAIL_USER,
            to:email,
            subject:"your otp code",
            text:`Your otpis ${otp}. it will expire in 5 minute`
        });

        res.status(201).json({message:"otp sent sucessfully"});
    } catch(err) {
         res.status(400).json({message:"user already exists"});
    }
}



//registration

exports.register = async(req,res)=>{
    const {name,email,password} = req.body;
    try {
        const hashedpassword = await bcrypt.hash(password,10);
        const user = await User.create({name,email,password:hashedpassword});
        res.status(201).json({message:"user registration sucessfully"});
    } catch(err) {
         res.status(400).json({message:"user already exists"});
    }
}

//login
exports.login = async(req,res)=>{
    const {email,password} = req.body;
    try {
        const user = await User.findOne({email});
        if(!user) return  res.status(400).json({message:"invalid credential"});

        const match = await bcrypt.compare(password,user.password);
         if(!match) return  res.status(400).json({message:"invalid credential"});
     
        const token = jwt.sign({userId:user._id},
            process.env.JWT_SECRET,{expiresIn:'30d'}
        );
        res.json({token});

        
    } catch(err) {
         res.status(400).json({message:"login failed"});
    }
}
exports.dashboard = (req,res)=>{
    res.json({message:"welcome to dashboard"});
}