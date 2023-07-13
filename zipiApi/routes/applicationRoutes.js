const express= require('express');
const { verifyToken, decryptToken } = require('../Middleware/JWT');
const AppRouter= express.Router();
const { registerUser, checkUserName, loginWithJWT, showHomePage, verifyLogin, appLogout, ContinueWithGoogleUser } = require('../Controller/applicationRequest');
const { handleGetAccessToken }= require('../Middleware/google-OAuth20')

AppRouter.post('/welcome',verifyToken, showHomePage)
AppRouter.post("/signUp", registerUser);
AppRouter.post("/login",loginWithJWT);
AppRouter.post("/:username/username",checkUserName)
AppRouter.get('/login/Success',verifyLogin)
AppRouter.get('/logout', verifyToken, decryptToken, appLogout )
AppRouter.post('/continueWithGoogle',ContinueWithGoogleUser)


module.exports = AppRouter;