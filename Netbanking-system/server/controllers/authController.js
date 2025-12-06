const User = require('../models/User');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


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