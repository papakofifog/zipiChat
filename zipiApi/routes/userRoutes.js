const express= require('express');
const { verifyToken, decryptToken } = require('../Middleware/JWT');
const UserRoute= express.Router();
const { getActiveUser,getFriends, createFriend, getAllUserSystem }= require('../Controller/userRequest');
const fileUpload  = require('../Util/handlefiles')
const { AddProfilePicture, storeSignFile}= require('../Controller/handleFileRequest')



UserRoute.get('/activeUser',verifyToken, decryptToken, getActiveUser)
UserRoute.get('/friends', verifyToken, decryptToken, getFriends)
UserRoute.post('/addFriend/',verifyToken,decryptToken, createFriend)
UserRoute.post('/addPicture', verifyToken,decryptToken,fileUpload.single('userProfile'),AddProfilePicture)
UserRoute.get('/adminAllusers',getAllUserSystem);
UserRoute.post('/upload',verifyToken,decryptToken,fileUpload.single('file'),function(req,res,next){
    storeSignFile(req,res,next);
})


module.exports= UserRoute;