const { findOneUserById }= require('../Module/user');
const { decryptToken }= require('../Middleware/JWT');
const { getFriendsDetails, getUserNumberFriends, addAfriend }= require('../Module/friendship');
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

async function createFriend(req,res,next){
    try{
        let userId= req.body['id'];
        let friend= req.body.friend;
        //console.log(friend)
        data={
            userId:userId,
            friendId:friend
        }
        let newUser=await addAfriend(data,next);
        if(newUser===true){
            return res.status(200).json(successMessage("New friend added"));
        }else{
            return res.status(400).json(failureMessage("Friend already exist"));
        }
        
    }catch(e){
        return next(e);
    }
    
    
}






module.exports= { getActiveUser,getFriends, createFriend };


