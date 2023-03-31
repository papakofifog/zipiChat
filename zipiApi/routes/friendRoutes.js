const express= require('express');
const FriendRouter = express.Router();

const { verifyToken, decryptToken } = require('../Middleware/JWT');
const {getFriends ,getAllUserNonFriends, createFriend, removeUsersFriend } = require('../Controller/friendRequest');

FriendRouter.get('/getUsersFriends', verifyToken, decryptToken, getFriends);
FriendRouter.get('/allnonFriends', verifyToken,decryptToken,getAllUserNonFriends);
FriendRouter.post('/addFriend',verifyToken,decryptToken, createFriend);
FriendRouter.post('/removeFriend',verifyToken,decryptToken, removeUsersFriend);


module.exports= FriendRouter;