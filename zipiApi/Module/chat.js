const mongoose= require('mongoose');


const fileObject = new mongoose.Schema({
    url: {
        type: String,  
    },
    type: {
        type: String,  
    },
    name: {
        type: String,  
    },
})

const messageObject= new mongoose.Schema({
    messageString: {
        type: String
    },
    fileSent: fileObject
})

const chats= new mongoose.Schema({
    message: messageObject,
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

let fileObjectSchema = mongoose.model('file', fileObject)

let messageObjectSchema= mongoose.model('messages',messageObject);

let chatSchema= mongoose.model('chat', chats);

async function addChat(data){

    try{
        let fileObject= new fileObjectSchema({
            url:data.message.fileSent.url,
            type:data.message.fileSent.type,
            name:data.message.fileSent.name
        })

        let actualMessage= new messageObjectSchema({
            messageString:data.message.messageString,
            fileSent: fileObject
        })

        let convo= new chatSchema({

            message: actualMessage,
            senderId: data.senderId,
            recipientId:data.recipientId,
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
        let retrivedChats1=await  chatSchema.find({$or:[{senderId:sender, recipientId:receiver},{senderId: receiver, recipientId:sender}]});
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

async function udpateOneChat(messageId, newMessage){
    try{
        let updatedMessage= chatSchema.updateOne(
            {_id: messageId},
            { $set: { message: newMessage.message } }
        )
        return await(updatedMessage).acknowledged;
    }catch(e){
        console.error(e);
    }

}

async function deleteOneChat(convoId){
    await chatSchema.deleteOne({_id:convoId}).catch((e)=>{
        console.error(e);
    })
}

module.exports= { addChat, retriveChats, updateReadStatusOfOneChat, udpateOneChat, deleteOneChat }