const express= require('express');
const { verifyToken } = require('../Middleware/JWT');
const AppRoute= express.Router();
const { registerUser, checkUserName, loginWithJWT, showHomePage,registerWithGoogle,googleRedirectCallback,googleLoginFailed, verifyLogin, appLogout } = require('../Controller/applicationRequest');

AppRoute.post('/welcome',verifyToken, showHomePage)
AppRoute.post("/signUp", registerUser);
AppRoute.post("/login",loginWithJWT);
AppRoute.get("/google", registerWithGoogle );
AppRoute.get('/googleLogin', (req,res,next)=>{
    res.send('<div><a href="/api/google">Login Django</a></div>');
})
AppRoute.get("/google/callback",googleRedirectCallback )
AppRoute.post("/:username/username",checkUserName)
AppRoute.get('/loigin/failed', googleLoginFailed)
AppRoute.get('/login/Success',verifyLogin)
AppRoute.get('/logout', appLogout )

//AppRoute.get("/registerUse")


module.exports = AppRoute;