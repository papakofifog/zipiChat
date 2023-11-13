const express= require('express');
const { verifyToken, decryptToken, verifyRefreshToken } = require('../Middleware/JWT');
const AppRouter= express.Router();
const { registerUser, checkUserName, loginWithJWT, showHomePage, verifyLogin, appLogout, ContinueWithGoogleUser, generateAccessTokenAndRefreshToken } = require('../Controller/applicationRequest');


AppRouter.post('/welcome',verifyToken, showHomePage)
AppRouter.post("/signUp", registerUser);
AppRouter.post("/login",loginWithJWT);
AppRouter.post("/:username/username",checkUserName)
AppRouter.get('/login/Success',verifyLogin)
AppRouter.get('/logout', verifyToken, decryptToken, appLogout );
AppRouter.post('/continueWithGoogle',ContinueWithGoogleUser);
AppRouter.get('/refreshToken',verifyRefreshToken,decryptToken,generateAccessTokenAndRefreshToken);




module.exports = AppRouter;