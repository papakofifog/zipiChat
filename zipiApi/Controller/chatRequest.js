const { addChat, retriveChats, updateReadStatusOfOneChat, deleteOneChat, udpateOneChat, doesMessageExist }= require('../Module/chat');
const { decryptToken }= require('../Middleware/JWT');
const { successMessage, userSuccess, failureMessage, success, failure } = require('../Middleware/handleResponse');
const { findUserByUserName, findOneUserById, doesUserExist } = require('../Module/user');

const saveMessage= async(req,res,next)=>{
    try{
        if(req.body.recipientId === "")return res.status(400).json(failureMessage("receipient id required"));
        let receivedData= await findUserByUserName(req.body.recipientId);
        if(!receivedData)return res.status(400).json(failureMessage("receipient does not exist"));
        let activeUserId= await findOneUserById(req.body.id);
        let sender=activeUserId.username;

        let newChatStatus=await addChat({
            message:req.body.message,
            senderId: sender,
            recipientId:req.body.recipientId
        });
        return newChatStatus?res.status(200).json(successMessage("Chat added")): res.status(400).json(failureMessage("Chat was not added"));
    }catch(e){
        next(e);
    }
}

const viewAllMessages= async (req,res,next)=>{
    try{
        if(req.body.receiver === "")return res.status(400).json(failureMessage("Receiver should be part of the query sent"));
        let receiver= req.body.receiver;
        let activeUser= await findOneUserById(req.body.id); 
        let allmessages= await retriveChats(activeUser.username,receiver);
        return allmessages? res.status(200).json(userSuccess(allmessages)): res.status(400).json(failureMessage("No message between sender and receiver"));
    }catch(e){
        next(e)
    }
}

const updateReadStatus= async (req,res,next)=>{
    let data= req.body || req.query;
    let updateStatus= await updateReadStatus(data.sender,data.receiver);
    return updateStatus?res.json(success):res.json(failure)
}

const updateMessage= async (req, res, next) =>{
    try{
        if(!req.params.messageId)return res.json(failureMessage("Message Id is required"));
        let activeUser= await findOneUserById(req.body.id);
        let specificMessage= await doesMessageExist(req.params.messageId,activeUser.username);
        if(!specificMessage)return res.json(failureMessage("Message with this Id does not exist"));
        //console.log(req)
        let messageUpdated= await udpateOneChat(req.params.messageId, activeUser.username, req.body);
        return messageUpdated?res.status(200).json(successMessage("Chat updated succesfully")): res.status(400).json(failureMessage("Your chat has not been updated yet. We are working with team to resolve this issue as soon as possible"));
    }catch(e){
        next(e);
    }
}

const deleteMessage= async (req, res, next)=>{
    try{
        if(!req.params.messageId)return res.json(failureMessage("Message Id is required"));
        let activeUser= await findOneUserById(req.body.id);
        let specificMessage= await doesMessageExist(req.params.messageId,activeUser.username);
        if(!specificMessage)return res.json(failureMessage("Message with this Id does not exist"));
        let messageDeleted= await deleteOneChat(req.params.messageId,activeUser.username);
        return messageDeleted? res.status(200).json(successMessage("Chat Deleted Succesfully")): res.status(400).json(failureMessage("Chat Not Deleted"));
    }catch(e){
        next(e)
    }
}

module.exports= { 
    saveMessage, 
    viewAllMessages,
    updateReadStatus,
    updateMessage,
    deleteMessage
 }