const express= require('express');
const { verifyToken, decryptToken } = require('../Middleware/JWT');
const UserRoute= express.Router();
const { getActiveUser,getFriends, createFriend, getAllUserSystem }= require('../Controller/userRequest');
const fileUpload  = require('../Util/handlefiles')
const upload= require('../Controller/userRequest');
const { AddProfilePicture}= require('../Controller/handleFileRequest')



UserRoute.get('/activeUser',verifyToken, decryptToken, getActiveUser)
UserRoute.get('/friends', verifyToken, decryptToken, getFriends)
UserRoute.post('/addFriend/',verifyToken,decryptToken, createFriend)
UserRoute.post('/addPicture', verifyToken,decryptToken,fileUpload.single('userProfile'),AddProfilePicture)
UserRoute.get('/adminAllusers',getAllUserSystem);


module.exports= UserRoute;