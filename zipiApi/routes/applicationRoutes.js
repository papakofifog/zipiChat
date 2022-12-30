const express= require('express');
const { verifyToken } = require('../Middleware/JWT');
const  verifyGoogleAccessToken = require('../Middleware/google-OAuth20')
const AppRoute= express.Router();
const { registerUser, checkUserName, loginWithJWT, showHomePage, verifyLogin, appLogout } = require('../Controller/applicationRequest');

AppRoute.post('/welcome',verifyToken, showHomePage)
AppRoute.post("/signUp", registerUser);
AppRoute.post("/login",loginWithJWT);
AppRoute.post('/LoginWithGoogle',verifyGoogleAccessToken)
AppRoute.post("/:username/username",checkUserName)
AppRoute.get('/login/Success',verifyLogin)
AppRoute.get('/logout', appLogout )



module.exports = AppRoute;