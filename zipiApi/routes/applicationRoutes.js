const express= require('express');
const { verifyToken, decryptToken } = require('../Middleware/JWT');
const AppRoute= express.Router();
const { registerUser, checkUserName, loginWithJWT, showHomePage, verifyLogin, appLogout } = require('../Controller/applicationRequest');
const { handleGetAccessToken }= require('../Middleware/google-OAuth20')

AppRoute.post('/welcome',verifyToken, showHomePage)
AppRoute.post("/signUp", registerUser);
AppRoute.post("/login",loginWithJWT);
AppRoute.post("/:username/username",checkUserName)
AppRoute.get('/login/Success',verifyLogin)
AppRoute.get('/logout', verifyToken, decryptToken, appLogout )
AppRoute.post('/googleLogin',handleGetAccessToken)


module.exports = AppRoute;