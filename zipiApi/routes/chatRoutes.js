const { application } = require('express');
const express= require('express');
const { saveMessage, viewAllMessages, updateReadStatus }= require('../Controller/chatRequest');
const InterceptMessage =require('../Controller/converstion')
const { verifyToken } = require('../Middleware/JWT');

const Chatrouter = express.Router();

Chatrouter.post('/addmessage',verifyToken, saveMessage);
Chatrouter.post('/readAllConvo',verifyToken,viewAllMessages);
Chatrouter.put('/isMessageRead', verifyToken,updateReadStatus);



module.exports= Chatrouter;