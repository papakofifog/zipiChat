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
        let friends= await friendshipSchema.find({userId:userID});
        return friends;
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





async function addRelationship(data){
    try{
            let newFriend= new friendshipSchema({
            userId:data.userId,
            userFriendId:data.friendId
        });
        await newFriend.save()
    }catch(e){
        console.error(e)
    }
    
}

async function addNewFriend(user,data){
    try{
        user.userFriendId.push(data.friendId);
        user.save();
    }catch(e){
        return e;
    }
    
}



async function addAfriend(data,next){
    try{
        let user= await doesUserHaveRelationship(data.userId);
        if(user){
            if(user.userFriendId.includes(data.friendId)){
                return false;
            }
            await addNewFriend(user,data);
            return true
        }else{
            await addRelationship(data);
            return true;
        } 
    }catch(e){
        next(e)
    }
}



module.exports=  { retriveUserFriends, addAfriend }