require('dotenv').config();
const User= require('../Module/user')
const bcrypt= require('bcrypt');
const { createToken } = require('../Middleware/JWT')

const registerUser= async (req,res,next) =>{
    try{
        const { firstname,lastname,username,email,password,Dob }= req.body
        
        if(!(firstname,lastname,username && email && password && Dob))return res.json({"message":"Body not formated properly"});
        let existingUser= await User.findOne({email:email});
        if(existingUser)return res.json({"message":"User already exist proceed to Login"})
        let salt= await bcrypt.genSalt(11);
        let encruptedpassword= await bcrypt.hash(password,salt);
        const newUser= new User({
            firstname:firstname,
            lastname:lastname,
            username:username,
            email:email,
            password:encruptedpassword,
            Dob:Dob
        })
        let userAccesstoken=createToken(newUser);
        newUser.token=userAccesstoken;
        await newUser.save();
        res.status(201).json(newUser)
    }catch(err){
        next(err)
    }
    
}


const loginWithJWT= async (req,res,next) =>{
    try{
        const { email, password }= req.body;
        if(!(email && password))res.status(400).json("All inputs required")
        const user= await User.findOne({ email: email });
        const userIsverified= bcrypt.compare(password, user.password);
        if(userIsverified){
            const token= createToken(user);
            user.token= token;
            return res.status(200).json(user);
        }
        return 
    }catch(err){
        next(err)
    }
}

module.exports= { registerUser, loginWithJWT };