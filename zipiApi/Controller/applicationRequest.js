require('dotenv').config();
const { createUser,findOneUser,doesUserExist,checkRegisterDataformat, checkLoginDataformat }= require('../Module/user')
const { encryptedPassword, verifyPassword} = require('../Middleware/encryptData');
const { createToken } = require('../Middleware/JWT');
const { successMessage, failureMessage, success, failure } = require('../Middleware/handleResponse')
//require('../Middleware/google-OAuth20')
const passport = require('passport');
const GoogleStrategy= require('passport-google-oauth2').Strategy;

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;

passport.use(new GoogleStrategy({
  clientID: GOOGLE_CLIENT_ID,
  clientSecret: GOOGLE_CLIENT_SECRET,
  callbackURL: "http://localhost:3000/api/google/callback",
  passReqToCallback: true,
},
function(request, accessToken, refreshToken, profile, done) {
  return done(null, profile);
}));

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});



const registerUser= async (req,res,next) =>{
    try{
        if(!(checkRegisterDataformat(req.body)))return res.json(failureMessage("All inputs requred"));
        let existingUser= await doesUserExist({email:req.body.email});
        if(existingUser) return res.json(successMessage("User exists proceeding to login"))
        req.body.password= await encryptedPassword(req.body.password,next)
        newUser= await createUser(req.body,next);
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
    passport.authenticate('google', {scope: ['profile']});
}

const googleRedirectCallback= (req,res,next) =>{
    try{
        console.log("we are here")
        passport.authenticate('google',{
            successRedirect: process.env.CLIENT_URL,
            failureRedirect:'/login/failed'
        })
    }catch(e){
        next(e)
    }
    
}

const googleLoginFailed= (req,res,next)=>{
    res.status(401).json(failureMessage("Login failure"))
}

const verifyLogin= (req,res,next)=>{
    if (req.user){
        res.status(200).json(successMessage("Successfully Login in ", req.user))
    }else{
        res.status(403).json(failureMessage("Not Authorized"))
    }
}

const appLogout= (req, res, next)=>{
    req.logout();
    res.redirect(process.env.CLIENT_URL)
}



module.exports= { registerUser, checkUserName, loginWithJWT, showHomePage,registerWithGoogle,googleRedirectCallback,googleLoginFailed, verifyLogin, appLogout };