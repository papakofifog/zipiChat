const mongoose = require('mongoose');


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
        required: (true, "friend reference is required")
    }
});

let friendshipSchema= mongoose.model('friend', friendSchema);


async function retriveUserFriends(userID){
    try{
        let friends= await friendshipSchema.findOne({userId:userID});
        return friends;
    }catch(e){
        console.error(e)
    }
    
}

async function getRelationship(userId){
    try{
        let userRelationship = friendshipSchema.findOne({userId: userId});
        return userRelationship
    }catch(e){
        console.error(e)
    }
    
}

async function addNewFriend(user,data,next){
    try{
        user.userFriendId.push(data.friendId);
        user.save();
    }catch(e){
        next(e);
    }
    
}

async function addAfriend(data,next){
    try{
        let friend= await getRelationship(data.userId)
        console.log(friend)
        if(friend.userFriendId.includes(data.friendId)){
                return false;
        }
        await addNewFriend(friend,data,next);
        return true
        
    }catch(e){
        next(e)
    }
}

async function removeFriend(user,data,next){
    try{
        let userFriends=user.userFriendId.filter(friendId => (friendId).toString() !== data.friendId );
        user.userFriendId=userFriends;
        user.save();
    }catch(e){
        next(e)
    }
}

async function removeAFriend(data,res,next){
    try{
        let friend=  await getRelationship(data.userId);
        if(friend){
            if(friend.userFriendId.includes(data.friendId)){
                await removeFriend(friend,data,next);
                return true;
            }else{
                return false;
            }
            
        }else{
            return false;
        }
    }catch(e){
        next(e)
    }
    
}



module.exports=  { friendshipSchema, retriveUserFriends, addAfriend, removeAFriend, getRelationship }