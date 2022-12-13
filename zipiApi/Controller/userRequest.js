const { findOneUserById }= require('../Module/user');
const { retriveUserFriends, addAfriend }= require('../Module/friendship');
const { userSuccess, successMessage, failureMessage}= require('../Middleware/handleResponse');
const { getUserpicture } = require('../Module/userPictures');


async function getActiveUser(req,res,next){
    try{
        let userId= req.body['id'];
        let user= await findOneUserById(userId).catch((e)=>{
            next(e);
        })

        let numberOfFriends= await getUserNumberFriends(userId).catch((e)=>{
            next(e)
        })

        let usersPicture= await getUserpicture(userId);
        
        let returnUser= {
            firstname: user.firstname,
            lastname: user.lastname,
            email: user.email,
            Dob:user.Dob,
            friendCount: numberOfFriends,
            pictures:usersPicture.userPicUrl||''
        }
        return res.status(200).json(userSuccess(returnUser));
    }catch(e){
        next(e)
    }
    
}

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
                friendDetails.push({userId:user._id,fullname:user.firstname+" "+user.lastname,username:user.username, userPic:userPicture||''});
            }
               
        }
        return friendDetails;
    }catch(e){
        console.error(e)
    }
}

async function createFriend(req,res,next){
    try{
        if(req.body.friend==='') return res.json.status(400).json(failureMessage("friend not specified"));
        let userId= req.body['id'];
        let friend= req.body.friend;
        data={
            userId:userId,
            friendId:friend
        }
        data2={
            userId:friend,
            friendId:userId
        }
        let newUser=await addAfriend(data,next);
        let newfriend1 = await addAfriend(data2,next);
        if(newUser===true && newfriend1){
            return res.status(200).json(successMessage("Friendship Created"));
        }else{
            return res.status(400).json(failureMessage("Broken friendship why"));
        }
        
    }catch(e){
        return next(e);
    }  
}






module.exports= { getActiveUser,getFriends, createFriend };


