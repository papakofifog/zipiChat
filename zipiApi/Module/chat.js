const mongoose= require('mongoose');

const user= require('./user')

const chats= new mongoose.Schema({
    message: {
        type: String,
        max_length:255
    },
    sender_id: {
        type: String
    },
    receiver_id: {
        type: String 
    }
    
}, {timestamps: true}
);

let chatSchema= mongoose.model('chat', chats);

async function addChat(data){
    try{
        let convo= new chatSchema({
            message:data.message,
            sender_id: data.senderId,
            receiver_id:data.recipientId
        });
        await convo.save();
        return true;
    }catch(e){
        console.error(e)
        return false;
    } 
}

async function retriveChats(sender,receiver){
   try{
        let retrivedChats=await chatSchema.find({sender_id:sender, receiver_id:receiver});
        return retrivedChats;

   }catch(e){
        console.error(e)
        return false;
   }
}

async function deleteOneChat(convoId){
    await chatSchema.deleteOne({_id:convoId}).catch((e)=>{
        console.error(e);
    })
}

module.exports= { addChat, retriveChats, deleteOneChat }