const { default: mongoose, default: mongoose, default: mongoose } = require('mongoose');
const mongoose= require('mongoose');

const friendSchema = new mongoose.Schema({
    userId:{
        type: mongoose.Types.ObjectId,
        ref: 'user'
    },
    userFriend: {
        type: mongoose.Types.ObjectId,
        ref:'user'
    }
});

let friendshipSchema= mongoose.model('friend', friendSchema);


async function retriveUserFriends(userID){
    let friends= await friendshipSchema.find({userId:userID}).catch((e)=>{
        console.error(e);
    });
    return friends;
}

async function addAfriend(data){
    let newFriend= new friendshipSchema({
        userId:data.userId,
        userFriend:data.userFriend
    });

    await newFriend.save().catch((e)=>{
        console.error(e)
    })
}

module.exports=  { retriveUserFriends, addAfriend }