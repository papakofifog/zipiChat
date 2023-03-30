const { retriveUserFriends, addAfriend }= require('../Module/friendship');
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
        let friendDetails= [];
        for(let i=0; i < friends.length; i++){
            for(let j=0; j<friends[i].userFriendId.length; j++){
                let user = await findOneUserById(friends[i].userFriendId[j]);
                let userPicture= await getUserpicture(user._id);
                friendDetails.push({userId:user._id,firstname:user.firstname,lastname:user.lastname,username:user.username, userPic:userPicture||'',loginStatus:user.loginStatus||false});
            }
               
        }
        return friendDetails;
    }catch(e){
        console.error(e)
    }
}

async function createFriend(req,res,next){
    try{
        if(!req.body.friend) return res.status(400).json(failureMessage("friend field not specified"));
        let userId= req.body['id'];
        //let friend= req.body.friend;
        let friend= await findUserByUserName(req.body.friend)
        
        let data={
            userId:userId,
            friendId:friend._id
        }
        let data2={
            userId:friend,
            friendId:userId
        }
        let newUser=await addAfriend(data,next);
        let newfriend1 = await addAfriend(data2,next);
        if(newUser===true && newfriend1){
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
        let activeUserFriends= retrieveActiveUserFriends[0].userFriendId;
        activeUserFriends.push(activeUser._id)
        let activeUserNonFriends=users.filter(zipiUser => activeUserFriends.indexOf(zipiUser._id) === -1); 
        return res.json(successMessage("Users Non Friends are ", activeUserNonFriends));
    }catch(e){
       return next(e)
    }
}

async function removerUsersFriend(req,res,next){
    try{
        if(!req.body.friend) return res.status(400).json(failureMessage("friend field not specified"));
        let activeUser= await findOneUserById(req.body['id']).catch((e)=>{
            return next(e);
        });

        /*let retrieveActiveUserFriends= await  retriveUserFriends(req.body['id']);
        let activeUserFriends= retrieveActiveUserFriends[0].userFriendId;*/


    }catch(e){
        console.error(e)
    }
}

module.exports= { getUserNumberFriends, getFriends, createFriend, getAllUserNonFriends }