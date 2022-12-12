const mongoose = require('mongoose');
const { findOneUserById } = require('./user');

const friendSchema = new mongoose.Schema({
    userId:{
        type: mongoose.Types.ObjectId,
        ref: 'user',
        unique: true,
        required: (true, "user reference is required")
    },
    userFriendId: {
        type: [mongoose.Types.ObjectId],
        ref:'user',
        required: (true, "friend reference is required"),
        unique: true
    }
});

let friendshipSchema= mongoose.model('friend', friendSchema);


async function retriveUserFriends(userID){
    try{
        let friends= await friendshipSchema.find({userId:userID});
        return friends;
    }catch(e){
        console.error(e)
    }
    
}

async function getFriendsDetails(userID){
    try{
        let friends= await retriveUserFriends(userID);
        //console.log(friends)
        let friendDetails= [];
        for(let i=0; i < friends.length; i++){
            for(let j=0; j<friends[i].userFriendId.length; j++){
                let user = await findOneUserById(friends[i].userFriendId[j]);
                friendDetails.push({userId:user._id,fullname:user.firstname+" "+user.lastname,username:user.username, userPic:user.userPictures[0]||'no picture found'});
            }
               
        }
        return friendDetails;
    }catch(e){
        console.error(e)
    }
}

async function doesUserHaveRelationship(userID){
    try{
        let user= await friendshipSchema.findOne({userId:userID});
        return user;
    }catch(e){
        console.error(e)
    }
}



async function getUserNumberFriends(userID){
    let friends= await getFriendsDetails(userID).catch((e)=>{
        console.error(e)
    });
    
    return friends.length;
}

async function addRelationship(data){
    try{
            let newFriend= new friendshipSchema({
            "userId":data.userId,
            userFriendId:data.friendId
        });
        await newFriend.save()
    }catch(e){
        console.error(e)
    }
    
}

async function addNewFriend(user){
    user.userFriendId.push(data.friendId);
    user.save();
}



async function addAfriend(data,next){
    try{
        let user= await doesUserHaveRelationship(data.userId);
        if(user){
            if(user.userFriendId.includes(data.friendId)===true){
                return false;
            } 
            await addNewFriend(user);
            return true
        }else{
            await addRelationship(data);
            return true;
        } 
    }catch(e){
        return next(e)
    }
}

module.exports=  { retriveUserFriends, getFriendsDetails, getUserNumberFriends, addAfriend }