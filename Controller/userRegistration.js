require('dotenv').config();
const User= require('../Module/user')
const bcrypt= require('bcrypt');
const { deleteOne } = require('../Module/user');
const { createToken, validateToken }= require('../Middleware/JWT')

const registerUser= async (req,res,next,done) =>{
    try{
        const { username,email,password,Dob }= req.body
        if(!(username && email && password && Dob))return res.json({"message":"Body not formated properly"});
        const existingUser= await User.findOne(email);
        if(existingUser)return res.json({"message":"User already exist proceed to Login"})
        let salt= await bcrypt.genSalt(process.env['SALT']);
        let encrptPassword= await bcrypt.hash(password,salt);
        const newUser= await User.create({
            username,
            email,
            encrptPassword,
            Dob
        })
        let userAccesstoken=createToken(newUser);
        newUser.token=userAccesstoken;
        res.status(201).json(newUser)
    }catch(err){
        next(err)
    }
    
}





const loginWithJWT= async (req,res,next) =>{
    try{
        const { email, password }= req.body;
        const user= await User.findOne({ username: username });
        const userIsverified= await bcrypt.compare(password, user.password);
        
    }catch(err){
        next(err)
    }
}

module.exports= registerUser;