const express= require('express');
const FriendRouter = express.Router();

const { verifyToken, decryptToken } = require('../Middleware/JWT');
const {getFriends ,getAllUserNonFriends, createFriend, removeUsersFriend,addFreiendRequest, getAllActiveUserFriendRequest, removeUserFriendRequest } = require('../Controller/friendRequest');

FriendRouter.get('/getUsersFriends', verifyToken, decryptToken, getFriends);
FriendRouter.get('/allnonFriends', verifyToken,decryptToken,getAllUserNonFriends);
FriendRouter.post('/addFriend',verifyToken,decryptToken, createFriend);
FriendRouter.post('/removeFriend',verifyToken,decryptToken, removeUsersFriend);
FriendRouter.post('/sendFriendRequest',verifyToken,decryptToken,addFreiendRequest);
FriendRouter.post('/cancelFriendRequest', verifyToken,decryptToken,removeUserFriendRequest)
FriendRouter.get('/getAllFriendRequest', verifyToken,decryptToken,getAllActiveUserFriendRequest)
//FriendRouter.post('/removeFriendRequest',verifyToken,decryptToken,removeUserFriendRequest)

module.exports= FriendRouter;