require('dotenv').config();
const { createUser,findOneUser,doesUserExist,checkRegisterDataformat, checkLoginDataformat }= require('../Module/user')
const { encryptedPassword, verifyPassword} = require('../Middleware/encryptData');
const { createToken } = require('../Middleware/JWT');
const { successMessage, failureMessage } = require('../Middleware/handleResponse')
const passport= require('passport');
require('../Middleware/google-OAuth20')

const registerUser= async (req,res,next) =>{
    try{
        if(!(checkRegisterDataformat(req.body)))return res.json(failureMessage("All inputs requred"));
        let existingUser= await doesUserExist({email:req.body.email});
        if(existingUser) return res.json(failureMessage("User already exist proceed to Login"))
        req.body.password= await encryptedPassword(req.body.password,next)
        newUser= createUser(req.body);
        //if(newUser) return next(newUser);
        return res.json(successMessage("User Registered",newUser))
    }catch(err){
        return next(err)
    }
    
}


const loginWithJWT= async (req,res,next) =>{
    try{
        if(checkLoginDataformat(req.body)===false)return res.status(400).json(failureMessage("All inputs required"));
        let user= await findOneUser({email:req.body.email});
        if(!user)return res.json(failureMessage("User does not exist proceed to SignUp"));
        const isPasswordVerified= await verifyPassword(req.body.password, user.password);
        if(isPasswordVerified){
            const token= await createToken(user);
            return res.json(successMessage('Login Successfull',user="User verified",token));
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

const registerWithGoogle= (req,res,next)=>{
    try{
        passport.authenticate('google', {scope: ['email','profile']});
    }catch(e){
        next(e)
    }
}

const googleRedirectCallback= (req,res,next) =>{
    try{
        passport.authenticate('google',{
            successRedirect: 'api/registerUser',
            failureRedirect:'api/failure'
        })
    }catch(e){
        next(e)
    }
    
}

const registerGoogleUser= (req,res,next) =>{
    console.log(req)
    return
}



module.exports= { registerUser, loginWithJWT, showHomePage,registerWithGoogle,googleRedirectCallback };