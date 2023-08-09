const express= require('express');
const {handleSendUserEmailNotification}= require('../Controller/mailRequest');

const mailRouter= express.Router();


mailRouter.post('/sendEmail',handleSendUserEmailNotification);


module.exports=mailRouter;