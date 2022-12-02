require('dotenv').config();
const { createUser,findOneUser,doesUserExist,checkRegisterDataformat, checkLoginDataformat }= require('../Module/user')
const { encryptedPassword, verifyPassword} = require('../Middleware/encryptData');
const { createToken } = require('../Middleware/JWT');
const { successMessage, failureMessage } = require('../Middleware/handleResponse')


const registerUser= async (req,res,next) =>{
    try{
        if(!(checkRegisterDataformat(req.body)))return res.json(failureMessage("All inputs requred"));
        let existingUser= await doesUserExist({email:req.body.email});
        if(existingUser)return res.json(failureMessage("User already exist proceed to Login"))
        req.body.password= await encryptedPassword(req.body.password)
        const newUser= await createUser(req.body)
        return res.json(successMessage("User Registered",newUser))
    }catch(err){
        next(err)
    }
    
}


const loginWithJWT= async (req,res,next) =>{
    try{
        if(checkLoginDataformat(req.body)===false)return res.status(400).json(failureMessage("All inputs required"));
        let user= await findOneUser({email:req.body.email});
        console.log(req.body.password)
        const isPasswordVerified= await verifyPassword(user.password,req.body.password)
        if(isPasswordVerified){
            const token= await createToken(user);
            return res.json(successMessage('Login Successfull',user,token));
        }
        return res.json(failureMessage("Invalid username or password"));
    }catch(err){
        next(err)
    }
}

const showHomePage = (req, res, next) =>{
    try{
        return res.json(successMessage('Login Successful'))
    }catch(err){
        next(err)
    }
}

module.exports= { registerUser, loginWithJWT, showHomePage };