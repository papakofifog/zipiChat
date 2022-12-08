const express= require('express');
const { verifyToken } = require('../Middleware/JWT');
const UserRoute= express.Router();
const { getActiveUser,getFriends, createFriend }= require('../Controller/userRequest');





UserRoute.get('/activeUser',verifyToken, getActiveUser)
UserRoute.get('/friends', verifyToken, getFriends)
UserRoute.post('/addFriend/',verifyToken,createFriend)


module.exports= UserRoute;