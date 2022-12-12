const express= require('express');
const { verifyToken, decryptToken } = require('../Middleware/JWT');
const UserRoute= express.Router();
const { getActiveUser,getFriends, createFriend }= require('../Controller/userRequest');
const fileUpload  = require('../Util/handlefiles')
const upload= require('../Controller/userRequest');
const { AddProfilePicture ,allPictures }= require('../Controller/handleFileRequest')



UserRoute.get('/activeUser',verifyToken, decryptToken, getActiveUser)
UserRoute.get('/friends', verifyToken, decryptToken, getFriends)
UserRoute.post('/addFriend/',verifyToken,decryptToken, createFriend)
UserRoute.post('/addPicture', verifyToken,decryptToken,fileUpload.single('userProfile'),AddProfilePicture)
UserRoute.get('/userProfiles',allPictures);


module.exports= UserRoute;