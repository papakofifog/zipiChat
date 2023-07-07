const { retriveUserFriends, addAfriend,removeRelationship,addFriendRequest, getRelationship, retriveActiveUserRequest, removeFriendRequest }= require('../Module/friendship');
const { findUserByUserName, findOneUserById, getAllUsers } = require('../Module/user');
const { getUserpicture } = require('../Module/userPictures');
const { userSuccess, successMessage, failureMessage}= require('../Middleware/handleResponse');

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
        let takeFriendRequestOut=removeFriendRequest(activeUserRelationship, next);
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

async function getAllUserNonFriends(req,res,next){
    try{
        let users= await getAllUsers();
        let activeUser= await findOneUserById(req.body['id']).catch((e)=>{
            return next(e);
        })
    
        let retrieveActiveUserFriends= await  retriveUserFriends(req.body['id'])
        //retrieveActiveUserFriends.push(activeUser._id)
        let activeUserNonFriends=users.filter(zipiUser => retrieveActiveUserFriends.indexOf(zipiUser._id) === -1); 
        
        return res.json(successMessage("Users Non Friends are ", activeUserNonFriends));
    }catch(e){
       return next(e)
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

async function removeUserFriendRequest(req,res,next){
    try{


        let friend= await findUserByUserName(req.body.friend)
        
        if(!friend) return res.status(400).json(failureMessage("User Provided does not exist"));
        
        let data={
            userId:req.body['id'],
            friendId: friend._id
        }

        let friendRequestTakenOut= await removeFriendRequest(data,next);
        if(friendRequestTakenOut){
            return res.send(successMessage("friend request removedSuccesfully"))
        }
        return res.send(failureMessage("friend request removal failed"))
    }catch(e){
        next(e);
    }
}

module.exports= { getUserNumberFriends, getFriends, createFriend, getAllUserNonFriends, removeUsersFriend,addFreiendRequest, getAllActiveUserFriendRequest, removeUserFriendRequest }