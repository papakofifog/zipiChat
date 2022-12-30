const { addChat, retriveChats, deleteOneChat }= require('../Module/chat');
const { decryptToken }= require('../Middleware/JWT');
const { successMessage, userSuccess, failureMessage } = require('../Middleware/handleResponse');

const saveMessage= async(data)=>{
    let newChatStatus=await addChat(data);
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

module.exports= { saveMessage, viewAllMessages }