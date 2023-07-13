require('dotenv').config();
const { createUser,findOneUser,doesUserExist,checkRegisterDataformat, checkLoginDataformat, updateLoginStatus, createGoogleSocialAuthUser }= require('../Module/user')
const { encryptedPassword, verifyPassword} = require('../Middleware/encryptData');
const { createToken } = require('../Middleware/JWT');
const { successMessage, failureMessage, success, failure } = require('../Middleware/handleResponse')
//require('../Middleware/google-OAuth20')
require('dotenv').config();





const registerUser= async (req,res,next) =>{
    try{
        if(!(checkRegisterDataformat(req.body)))return res.json(failureMessage("All inputs requred"));

        
        let existingUser= await doesUserExist({email:req.body.email});
        if(existingUser) return res.json(failureMessage("User exists proceeding to login"));

        req.body.password= await encryptedPassword(req.body.password,next)
        let newUser= await createUser(req.body,next);
        if(newUser) return next(newUser);
        return res.json(successMessage("User Registered",newUser))
    }catch(err){
        return next(err)
    }
    
}

async function checkUserName(req,res,next){
    try{
        let userName=req.query.username;
        let existingUserName= await doesUserExist({username:userName});
        if (existingUserName){
            return res.json(failure);
        }
        return res.json(success)
    }catch(e){
        return next(e);
    }
}

const loginWithJWT= async (req,res,next) =>{
    try{
        if(checkLoginDataformat(req.body)===false)return res.status(400).json(failureMessage("All inputs required"));
        let user= await findOneUser({email:req.body.email});
        if(!user)return res.json(failureMessage("User does not exist proceed to SignUp"));
        const isPasswordVerified= await verifyPassword(req.body.password, user.password);
        if(isPasswordVerified){
            await updateLoginStatus({userId:user._id,status:true});
            const token= createToken(user);
            return res.json(successMessage('Login Successfull',"User verified",token));
        }
        return res.json(failureMessage("Invalid username or password"));
    }catch(err){
        next(err)
    }
}

const ContinueWithGoogleUser= async (req,res,next)=>{
    try{
        let user= await findOneUser({email:req.body.email});
        if(!user){ 
            // store the needed data.
            req.body.password= await encryptedPassword(req.body.password,next)
            user= await createGoogleSocialAuthUser(req.body,next);
           
        }

        await updateLoginStatus({userId:user._id,status:true});
        
        let token= createToken(user);
        return res.json(successMessage('Login Successfull',"User verified",token));
         
    }catch(e){
        next(e)
    }
}



const showHomePage = (req, res, next) =>{
    try{
        return res.json(successMessage('Login Successful'))
    }catch(err){
        next(err)
    }
}



const verifyLogin= (req,res,next)=>{
    if (req.user){
        res.status(200).json(successMessage("Successfully Login in ", req.user))
    }else{
        res.status(403).json(failureMessage("Not Authorized"))
    }
}

const appLogout= async (req, res, next)=>{
    try{
        let userId= req.body['id']|| req.user;
        let status=await updateLoginStatus({userId:userId,status:false});
        return res.json(status)
    }catch(e){
        next(e)
    }
}



module.exports= { registerUser, checkUserName, loginWithJWT, showHomePage, verifyLogin, appLogout, ContinueWithGoogleUser };