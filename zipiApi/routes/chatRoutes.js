const { application } = require('express');
const express= require('express');
const { 
    saveMessage, 
    viewAllMessages, 
    updateReadStatus,
    updateMessage,
    deleteMessage

}= require('../Controller/chatRequest');
const { verifyToken, decryptToken } = require('../Middleware/JWT');

const Chatrouter = express.Router();

Chatrouter.post('/addmessage:receipientId',verifyToken, saveMessage);
Chatrouter.get('/readAllConvo:receiver',verifyToken, decryptToken, viewAllMessages);
Chatrouter.put('/isMessageRead', verifyToken,updateReadStatus);
Chatrouter.put('/editMessage/:messageId',verifyToken, decryptToken, updateMessage )
Chatrouter.delete('/deleteMessage/:messageId', verifyToken, decryptToken, deleteMessage);


module.exports= Chatrouter;