const express= require('express');
const FriendRouter = express.Router();

const { verifyToken, decryptToken } = require('../Middleware/JWT');
const {
    getFriends ,
    getAllUserNonFriends, 
    createFriend, 
    removeUsersFriend,
    addFreiendRequest, 
    getAllActiveUserFriendRequest, 
    removeUserFriendRequest,
    searchAUsersFriendByName, 
    searchForNonUserFriends,
    searchForFriendWhoHasSentARequest,
    declineFriendRequest
} = require('../Controller/friendRequest');

FriendRouter.get('/getUsersFriends', verifyToken, decryptToken, getFriends);
FriendRouter.get('/searchUserFriendByName', verifyToken,decryptToken, searchAUsersFriendByName);
FriendRouter.get('/searchForNonUserFriends', verifyToken, decryptToken, searchForNonUserFriends);
FriendRouter.get('/allnonFriends', verifyToken,decryptToken,getAllUserNonFriends);
FriendRouter.get('/getAllFriendRequest', verifyToken,decryptToken,getAllActiveUserFriendRequest);
FriendRouter.get('/searchForFriendWhoHasSentARequest', verifyToken, decryptToken, searchForFriendWhoHasSentARequest)

FriendRouter.post('/addFriend',verifyToken,decryptToken, createFriend);
FriendRouter.post('/removeFriend',verifyToken,decryptToken, removeUsersFriend);
FriendRouter.post('/sendFriendRequest',verifyToken,decryptToken,addFreiendRequest);
FriendRouter.post('/cancelFriendRequest', verifyToken,decryptToken,removeUserFriendRequest)
FriendRouter.post('/declineRequest',verifyToken,decryptToken,declineFriendRequest)


module.exports= FriendRouter;