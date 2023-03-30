const express= require('express');
const { verifyToken, decryptToken } = require('../Middleware/JWT');
const UserRouter= express.Router();
const { getActiveUser, getAllUserSystem }= require('../Controller/userRequest');
const fileUpload  = require('../Util/handlefiles')
const { AddProfilePicture, storeSignFile}= require('../Controller/handleFileRequest')



UserRouter.get('/activeUser',verifyToken, decryptToken, getActiveUser)
UserRouter.post('/addPicture', verifyToken,decryptToken,fileUpload.single('userProfile'),AddProfilePicture)
UserRouter.get('/Allusers',verifyToken,decryptToken,getAllUserSystem);
UserRouter.post('/upload',verifyToken,decryptToken,fileUpload.single('file'),function(req,res,next){
    storeSignFile(req,res,next);
})


module.exports= UserRouter;