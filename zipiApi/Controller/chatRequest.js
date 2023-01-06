const { addChat, retriveChats, updateReadStatusOfOneChat, deleteOneChat }= require('../Module/chat');
const { decryptToken }= require('../Middleware/JWT');
const { successMessage, userSuccess, failureMessage, success, failure } = require('../Middleware/handleResponse');

const saveMessage= async(req,res,next)=>{
    let newChatStatus=await addChat(req.body);
    if (newChatStatus){
        return res.status(200).json("Chat added");
    }else{
        return res.status(400).json("Chat was not added");
    }

}

const viewAllMessages= async (req,res,next)=>{
    let data= req.body;
    let allmessages= await retriveChats(data.sender,data.receiver);
    if(allmessages){
        return res.status(200).json(userSuccess(allmessages))
    }else{
        return res.status(400).json(failureMessage("No message between sender and receiver"));
    }
}

const updateReadStatus= async (req,res,next)=>{
    let data= req.body || req.query;
    let updateStatus= updateReadStatus(data.sender,data.receiver);
    if(updateStatus){
        return res.json(success);
    }else{
        return res.json(failure)
    }
}

module.exports= { saveMessage, viewAllMessages, updateReadStatus }