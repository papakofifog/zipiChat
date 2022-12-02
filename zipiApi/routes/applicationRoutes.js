const express= require('express');
const { verifyToken } = require('../Middleware/JWT');
const AppRoute= express.Router();
const { registerUser, loginWithJWT, showHomePage,registerWithGoogle,googleRedirectCallback } = require('../Controller/applicationRequest');

AppRoute.post('/welcome',verifyToken, showHomePage)
AppRoute.post("/signUp", registerUser);
AppRoute.post("/login",loginWithJWT);
AppRoute.get("/google", registerWithGoogle );
AppRoute.get("/google/callback",googleRedirectCallback )
//AppRoute.get("/registerUse")


module.exports= AppRoute;