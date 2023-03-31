const { retriveUserFriends, addAfriend,removeAFriend, getRelationship }= require('../Module/friendship');
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

async function getFriendsDetails(userID){
    try{
        let friends= await retriveUserFriends(userID);
        let friendDetailsList=[];
        for(let j=0; j<friends.userFriendId.length; j++){
            let user = await findOneUserById(friends.userFriendId[j]);
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
        console.log(friendDetailsList)
        return friendDetailsList;
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
            userId:friend,
            friendId:userId
        }
        let newUser=await addAfriend(activeUserRelationship,next);
        let newfriend1 = await addAfriend(activeUserFriendRelation,next);
        if(newUser && newfriend1){
            return res.status(200).json(successMessage("Friendship Created"));
        }else{
            return res.status(400).json(failureMessage("Friend Already Exist"));
        }   
    }catch(e){
        return next(e);
    }  
}

async function getAllUserNonFriends(req,res,next){
    try{
        let users= await getAllUsers();
        let activeUser= await findOneUserById(req.body['id']).catch((e)=>{
            return next(e);
        })
        let retrieveActiveUserFriends= await  retriveUserFriends(req.body['id'])
        let activeUserFriends= retrieveActiveUserFriends.userFriendId;
        activeUserFriends.push(activeUser._id)
        let activeUserNonFriends=users.filter(zipiUser => activeUserFriends.indexOf(zipiUser._id) === -1); 
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

        let userId= req.body['id'];

        if((friend._id).toString() === userId) return res.status(400).json(failureMessage("An active User cannot be friends with himself"))
        
        let activeUserRelationship={
            userId:userId,
            friendId:friend._id
        }

        let activeUserFriendRelation={
            userId:friend,
            friendId:userId
        }
        let removeRelationship1=await removeAFriend(activeUserRelationship,res,next);
        let removeRelationship2 = await removeAFriend(activeUserFriendRelation,res,next);
        let results=removeRelationship1 && removeRelationship2;
        return results? res.json(successMessage("Relationship Broken successfully", results)): res.json(failureMessage("Something went wrong"))
    }catch(e){
        return next(e)
    }
}

module.exports= { getUserNumberFriends, getFriends, createFriend, getAllUserNonFriends, removeUsersFriend }