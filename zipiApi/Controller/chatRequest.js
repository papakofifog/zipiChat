const { addChat, retriveChats, updateReadStatusOfOneChat, deleteOneChat, udpateOneChat }= require('../Module/chat');
const { decryptToken }= require('../Middleware/JWT');
const { successMessage, userSuccess, failureMessage, success, failure } = require('../Middleware/handleResponse');
const { findUserByUserName, findOneUserById } = require('../Module/user');

const saveMessage= async(req,res,next)=>{
    try{
        if(!req.params.receipientId)return res.status(400).json(failureMessage("receipient id required"));
        let receivedData= await findUserByUserName(req.params.receipientId);
        if(!receivedData)return res.status(400).json(failureMessage("receipient does not exist"));
        let activeUserId= await findOneUserById(req.body.id);
        let newChatStatus=await addChat({
            message:req.body,
            senderId: activeUserId,
            receiverId:  req.params.receipientId
        });
        return newChatStatus?res.status(200).json(successMessage("Chat added")): res.status(400).json(successMessage("Chat was not added"));
    }catch(e){
        next(e);
    }
}

const viewAllMessages= async (req,res,next)=>{
    try{
        let receiver= req.params.receiver;
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
        if(req.body.sender != activeUser.username && req.body.receiver !=activeUser.username) return res.status(401).json(failureMessage("You are not authorized to edit this message"));
        let messageUpdated= await udpateOneChat(req.params.messageId,req.body);
        return messageUpdated?res.status(200).json(success): res.status(400).json(failure);
    }catch(e){
        next(e);
    }
}

const deleteMessage= async (req, res, next)=>{
    try{
        if(!req.params.messageId)return res.json(failureMessage("Message Id is required"));
        let activeUser= await findOneUserById(req.body.id);
    }catch(e){
        next(e)
    }
}

module.exports= { 
    saveMessage, 
    viewAllMessages,
    updateReadStatus,
    updateMessage
 }