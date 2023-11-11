const { retriveUserFriends, addAfriend,removeRelationship,addFriendRequest, getRelationship, retriveActiveUserRequest, removeFriendRequest }= require('../Module/friendship');
const { findUserByUserName, findOneUserById, getAllUsers } = require('../Module/user');
const { getUserpicture } = require('../Module/userPictures');
const { userSuccess, successMessage, failureMessage, success}= require('../Middleware/handleResponse');

async function getUserNumberFriends(userID){
    let friends= await getFriendsDetails(userID).catch((e)=>{
        console.error(e)
    });
    return friends.length;
}

async function getFriends(req,res,next){
    try{
        let userId= req.body['id'];
        let userFriends= await getFriendsDetails(userId).catch((e)=>{
            next(e);
        });
        return res.status(200).json(userSuccess(userFriends));
    }catch(e){
        next(e)
    }
    
}

async function searchAUsersFriendByName(req,res,next){
    try{
        let userId= req.body['id'];
        let userFriends= await getFriendsDetails(userId);
        return res.status(200).json(userSuccess(userFriends.filter((friend)=> friend.firstname.concat(' '+friend.lastname).toLowerCase().includes(req.query.friend.toLowerCase()) || friend.username.toLowerCase().includes(req.query.friend.toLowerCase()))));
    }catch(e){
        next(e)
    }
}

 

async function getUserDetails(friendIdList){
    let friendDetailsList=[];
    for(let friendId of friendIdList){
        let user = await findOneUserById(friendId);
        let userPicture= await getUserpicture(user._id);
       
        friendDetailsList.push(
            {
                userId:user._id,
                firstname:user.firstname,
                lastname:user.lastname,
                username:user.username, 
                userPic:userPicture||'',
                loginStatus:user.loginStatus||false
            });
    }
    return friendDetailsList;
}

async function getFriendsDetails(userID){
    try{
        let friends= await retriveUserFriends(userID);
        return  await getUserDetails(friends)
    }catch(e){
        console.error(e)
    }
}

async function createFriend(req,res,next){
    try{
        if(!req.body.friend) return res.status(400).json(failureMessage("friend field not specified"));
        
        let friend= await findUserByUserName(req.body.friend)
        
        if(!friend) return res.status(400).json(failureMessage("User Provided does not exist"));

        let userId= req.body['id'];

        if((friend._id).toString() === userId) return res.status(400).json(failureMessage("An active User cannot be friends with himself"))
        
        let activeUserRelationship={
            userId:userId,
            friendId:friend._id
        }
        let activeUserFriendRelation={
            userId:friend._id,
            friendId:userId
        }
        let newUser=await addAfriend(activeUserRelationship,next);
        let newfriend1 = await addAfriend(activeUserFriendRelation,next);
        let takeFriendRequestOut= await removeFriendRequest(activeUserFriendRelation, next);
        if(newUser && newfriend1 && takeFriendRequestOut){
            

            return res.status(200).json(successMessage("Friendship Created"));
        }else{
            return res.status(400).json(failureMessage("Friend Creation Failed"));
        }   
    }catch(e){
        return next(e);
    }  
}



async function addFreiendRequest(req, res,next){
    try{
        if(!req.body.friend) return res.status(400).json(failureMessage("friend field not specified"));
        
        let friend= await findUserByUserName(req.body.friend)
        
        if(!friend) return res.status(400).json(failureMessage("User Provided does not exist"));

        let userId= req.body['id'];

        if((friend._id).toString() === userId) return res.status(400).json(failureMessage("An active User cannot be friends with himself"));

        let proposedUserRelationship={
            userId:userId,
            friendId:friend._id
        }

        let newFriendRequest=await addFriendRequest(proposedUserRelationship,next);

        if(newFriendRequest){
            return res.status(200).json(successMessage("Friend Request Sent"));
        }else{
            return res.status(400).json(failureMessage("Friend Request Failed"));
        } 
        
    }catch(e){
        return next(e)
    }
}



async function getFriendIsRequestSentStatus(userId,friendId){
    let activeUserRequest= await retriveActiveUserRequest(friendId);
    return activeUserRequest.includes(userId);
}


async function getDetailsOfAllActiveUsersNonFriends(activeUser){
    let retrievedActiveUserFriends= await  retriveUserFriends(activeUser._id);
    retrievedActiveUserFriends.push(activeUser._id);
    let users= await getAllUsers();
    let activeUserNonFriendDetails=users.filter(nonFried => retrievedActiveUserFriends.indexOf(nonFried._id) === -1);
    let data=[];
    for (let friend of activeUserNonFriendDetails) {
        let isRequestSentStatus= await getFriendIsRequestSentStatus(activeUser._id,friend._id);
        data.push({
            id: friend._id,
            firstname:friend.firstname,
            lastname:friend.lastname,
            username:friend.username,
            email: friend.email,
            isRequestSent:isRequestSentStatus
        })
    }
    return data;
}


async function getAllUserNonFriends(req,res,next){
    try{
        let activeUser= await findOneUserById(req.body['id']);
        let activeUserNonFriends= await getDetailsOfAllActiveUsersNonFriends(activeUser);
        return res.json(successMessage("Users Non Friends are ", activeUserNonFriends));
    }catch(e){
       return next(e)
    }
}

async function searchForNonUserFriends(req, res, next){
    try{
        let activeUser= await findOneUserById(req.body['id']);
        let activeUserNonFriends= await getDetailsOfAllActiveUsersNonFriends(activeUser);
        let searchQuery= req.query.friend;

        let interestedNonFriends=activeUserNonFriends.filter(nonFriend=> nonFriend.firstname.toLowerCase().includes(searchQuery.toLowerCase()  || nonFriend.username.toLowerCase().includes(searchQuery.toLowerCase())));

        return res.status(200).json(successMessage("Non Friend is", interestedNonFriends))
    }catch(e){
        next(e)
    }
}





async function removeUsersFriend(req,res,next){
    try{
        if(!req.body.friend) return res.status(400).json(failureMessage("friend field not specified"));
        
        let friend= await findUserByUserName(req.body.friend)
        
        if(!friend) return res.status(400).json(failureMessage("User Provided does not exist"));

        let userID= req.body['id'];

        if((friend._id).toString() === userID) return res.status(400).json(failureMessage("An active User cannot be friends with himself"))
        
        let activeUserRelationship={
            userId:userID,
            friendId:friend._id
        }

        let activeUserFriendRelation={
            userId:friend._id,
            friendId:userID
        }
        
        let removeRelationship1=await removeRelationship(activeUserRelationship,res,next);
        let removeRelationship2 = await removeRelationship(activeUserFriendRelation,res,next);
        let results=removeRelationship1 && removeRelationship2;

        return results? res.json(successMessage("Relationship Broken successfully", results)): res.json({"relationship1": removeRelationship1,
    "relationship2": removeRelationship2})
    }catch(e){
        return next(e)
    }
}

async function getAllActiveUserFriendRequest(req, res, next){
    try{
        let userId= req.body['id'];
        let activeUserRequests= await retriveActiveUserRequest(userId);
        let activeUserRequestDetails= await getUserDetails(activeUserRequests);
        return activeUserRequestDetails ? res.json(successMessage("User request", activeUserRequestDetails)): res.json(failureMessage("There are issues with this code"));
    }catch(e){
        return next(e);
    }
}

async function searchForFriendWhoHasSentARequest(req,res, next){
    try{
        let userId= req.body['id'];
        let activeUserRequests= await retriveActiveUserRequest(userId);
        let activeUserRequestDetails= await getUserDetails(activeUserRequests);
        let searchQuery= req.query.friend;
        let specificRequest=activeUserRequestDetails.filter(friendWhoHasSentRequest=> friendWhoHasSentRequest.username.toLowerCase().includes(searchQuery.toLowerCase()));
        return res.status(200).json(successMessage("Aquainted to ",specificRequest));
    }catch(e){
        return next(e);
    }
}

async function removeUserFriendRequest(req,res,next){
    try{
        let friend= await findUserByUserName(req.body.friend)
        
        if(!friend) return res.status(400).json(failureMessage("User Provided does not exist"));

        let friendRelationship= await getRelationship(friend._id);

        console.log(friendRelationship)

        if( ! friendRelationship.userFriendIdRequests.includes(req.body['id'])){
            return res.status(400).json(failureMessage("friend request has not sent to this user"));
        }
        
        let data={
            userId:req.body['id'],
            friendId: friend._id
        }

        let friendRequestTakenOut= await removeFriendRequest(data,next);
        if(friendRequestTakenOut){
            return res.send(successMessage("friend request removed Succesfully"))
        }
        return res.send(failureMessage("friend request removal failed"))
    }catch(e){
        next(e);
    }
}

module.exports= { 
    getUserNumberFriends, 
    getFriends, 
    createFriend, 
    getAllUserNonFriends, 
    removeUsersFriend,
    addFreiendRequest, 
    getAllActiveUserFriendRequest, 
    removeUserFriendRequest,
    searchAUsersFriendByName, 
    searchForNonUserFriends, 
    searchForFriendWhoHasSentARequest,
}