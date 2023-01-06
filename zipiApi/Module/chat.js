const mongoose= require('mongoose');

const user= require('./user')

const chats= new mongoose.Schema({
    message: {
        type: String,
        max_length:255
    },
    senderId: {
        type: String
    },
    recipientId: {
        type: String 
    },
    readStatus: {
        type:Boolean,
        default: false
    }

    
}, {timestamps: true}
);

let chatSchema= mongoose.model('chat', chats);

async function addChat(data){
    try{
        console.log(data.sentAt)
        let convo= new chatSchema({
            message:data.message,
            senderId: data.senderId,
            recipientId:data.recipientId,
            sentAt: data.sentAt
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
        let retrivedChats1=await chatSchema.find({$or:[{senderId:sender, recipientId:receiver},{senderId: receiver, recipientId:sender}]});
        return retrivedChats1;

   }catch(e){
        console.error(e)
        return false;
   }
}

async function updateReadStatusOfOneChat(sender,receiver){
    try{
        let specificChat= await chatSchema.findOne({senderId:sender,recipientId:receiver,});
        specificChat.readStatus=true;
        specificChat.save();
        return true;
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

module.exports= { addChat, retriveChats, updateReadStatusOfOneChat, deleteOneChat }