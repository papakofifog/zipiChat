const express= require('express');
const { verifyToken, decryptToken } = require('../Middleware/JWT');
const UserRoute= express.Router();
const { getActiveUser,getFriends, createFriend }= require('../Controller/userRequest');





UserRoute.get('/activeUser',verifyToken, decryptToken, getActiveUser)
UserRoute.get('/friends', verifyToken, decryptToken, getFriends)
UserRoute.post('/addFriend/',verifyToken,decryptToken, createFriend)
UserRoute.post('/pFilePicture', verifyToken,decryptToken,)


module.exports= UserRoute;