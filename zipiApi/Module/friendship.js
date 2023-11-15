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
    },
    userFriendIdRequests: {
        type: [mongoose.Types.ObjectId],
        ref:'user',
        required: (true, "friend reference is required")
    }

});

let friendshipSchema= mongoose.model('friend', friendSchema);

async function getRelationship(userId){
    try{
        let userRelationship = friendshipSchema.findOne({userId: userId});
        return userRelationship;
    }catch(e){
        console.error(e)
    }
    
}

async function retriveUserFriends(userID){
    try{
        let friend= await getRelationship(userID);
        return friend.userFriendId;
    }catch(e){
        console.error(e)
    }
    
}

async function retriveActiveUserRequest(userID){
    try{
        let friend= await getRelationship(userID);
        return friend.userFriendIdRequests;
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

async function addNewFriendRequest(user,data,next){
    try{
        user.userFriendIdRequests.push(data.userId);
        user.save();
    }catch(e){
        next(e);
    }
}

async function addAfriend(data,next){
    try{
        let friend= await getRelationship(data.userId)
        //console.log(friend)
        if(friend.userFriendId.includes(data.friendId)){
                return false;
        }
        await addNewFriend(friend,data,next);
        return true
        
    }catch(e){
        next(e)
    }
}

async function addFriendRequest(data,next){
    try{
        let relationship= await getRelationship(data.friendId)
        if(relationship.userFriendId.includes(data.userId)){
            return false;
        }
        if(relationship.userFriendIdRequests.includes(data.userId)){
            return false;
        }
        await addNewFriendRequest(relationship,data,next);
        return true
        
    }catch(e){
        next(e)
    }
}

async function removeFriendRequest(data,next){
    try{
        let relationship= await getRelationship(data.friendId);
        //console.log(relationship)
        let newUserFriendRequest=relationship.userFriendIdRequests.filter((friendId)=>{
            console.log(friendId)
            return (friendId).toString()!==(data.userId).toString();
        });
        //console.log(newUserFriendRequest);
        relationship.userFriendIdRequests=newUserFriendRequest;
        relationship.save();
        return true;
    }catch(e){
        next(e);
    }
    

}

async function removeFriend(user,data,next){
    try{
        let userFriends=user.userFriendId.filter((friendId) => {
            // console.log((friendId).toString(), (data.friendId).toString() )
            return (friendId).toString() !== (data.friendId).toString() 
        } );
        user.userFriendId=userFriends;
        user.save();
    }catch(e){
        next(e);
    }
}

async function removeRelationship(data,res,next){
    try{
        let user=  await getRelationship(data.userId);
        
        if(user){
            if(user.userFriendId.includes(data.friendId)){
                
                await removeFriend(user,data,next);
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



module.exports=  { friendshipSchema, retriveUserFriends, addAfriend, addFriendRequest, removeRelationship, getRelationship, retriveActiveUserRequest,removeFriendRequest }