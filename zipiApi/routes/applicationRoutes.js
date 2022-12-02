const express= require('express');
const { verifyToken } = require('../Middleware/JWT');
const AppRoute= express.Router();
const { registerUser, loginWithJWT, showHomePage } = require('../Controller/applicationRequest');

AppRoute.post('/welcome',verifyToken, showHomePage)
AppRoute.post("/signUp", registerUser);
AppRoute.post("/login",loginWithJWT);


module.exports= AppRoute;