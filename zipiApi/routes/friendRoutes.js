const express= require('express');
const FriendRouter = express.Router();

const { verifyToken, decryptToken } = require('../Middleware/JWT');
const {getFriends ,getAllUserNonFriends, createFriend } = require('../Controller/friendRequest');

FriendRouter.get('/getUsersFriends', verifyToken, decryptToken, getFriends);
FriendRouter.get('/allnonFriends', verifyToken,decryptToken,getAllUserNonFriends);
FriendRouter.post('/addFriend',verifyToken,decryptToken, createFriend);



module.exports= FriendRouter;