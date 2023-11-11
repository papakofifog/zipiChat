const express= require('express');
const { verifyToken, decryptToken } = require('../Middleware/JWT');
const UserRouter= express.Router();
const { getActiveUser, getAllUserSystem, updateActiveUserData, updateUserPictureRequest, getActiveUsersPictureRequest, handlePasswordUpdate, getUsersLoginStatus }= require('../Controller/userRequest');
const fileUpload  = require('../Util/handlefiles')
const { AddProfilePicture, storeSignFile}= require('../Controller/handleFileRequest');


UserRouter.get('/activeUser',verifyToken, decryptToken, getActiveUser);
UserRouter.get('/Allusers',getAllUserSystem);
UserRouter.get('/getUserPicture', verifyToken, decryptToken, getActiveUsersPictureRequest);
UserRouter.get('/getUsersLoginStatus/:user', verifyToken, decryptToken, getUsersLoginStatus);

UserRouter.post('/addPicture', verifyToken,decryptToken,fileUpload.single('userProfile'),AddProfilePicture);
UserRouter.post('/upload',verifyToken,decryptToken,fileUpload.single('file'),function(req,res,next){
    storeSignFile(req,res,next);
})

UserRouter.put('/editProfile',verifyToken,decryptToken,updateActiveUserData);
UserRouter.put('/updatePicture',verifyToken,decryptToken,updateUserPictureRequest);
UserRouter.put('/updateUsersPassword', verifyToken, decryptToken,handlePasswordUpdate);

module.exports= UserRouter;