const mongoose= require('mongoose');

const user= require('./user')

const chats= new mongoose.Schema({
    message: {
        type: String,
        max_length:255
    },
    sender_id: {
        type: mongoose.Types.ObjectId,
        ref: 'user'
    },
    receiver_id: {
        type: mongoose.Types.ObjectId,
        ref: 'user'
    }
});

let chatSchema= mongoose.model('chat', chats);

async function addChat(data){
    let convo= new chatSchema({
        message:data.message,
        sender_id: data.sender_id,
        receiver_id:data.receiver_id
    });
    await convo.save().catch((e)=>{
        console.error(e);
    })
}

async function retriveChats(sender,receiver){
   let retrivedChats=await chatSchema.find({sender_id:sender, receiver_id:receiver}). catch((e)=>{
    console.error(e)
   })
   return retrivedChats;
}

async function deleteOneChat(convoId){
    await chatSchema.deleteOne({_id:convoId}).catch((e)=>{
        console.error(e);
    })
}

module.exports= { addChat, retriveChats, deleteOneChat }