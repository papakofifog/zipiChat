const { application } = require('express');
const express= require('express');
const { saveMessage, viewAllMessages }= require('../Controller/chatRequest');
const InterceptMessage =require('../Controller/converstion')
const { verifyToken } = require('../Middleware/JWT');

const Chatrouter = express.Router();

Chatrouter.post('/addmessage',verifyToken, saveMessage);
Chatrouter.get('/readAllConvo',verifyToken,viewAllMessages);



module.exports= Chatrouter;