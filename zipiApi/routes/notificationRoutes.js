const  express= require('express');
const { verifyToken, decryptToken } = require('../Middleware/JWT');
const {saveNotification,deleteOneNotificationRequest,deleteMultipleNotoficationRequest, getAllUserNotificationRequest}= require("../Controller/notificationRequest");

const notificationRouter= express.Router();

notificationRouter.get('/getUserNotifications', verifyToken, decryptToken, getAllUserNotificationRequest);

notificationRouter.delete("/deleteOneNotification",verifyToken,decryptToken,deleteOneNotificationRequest);
notificationRouter.delete("/deleteMultipleNotification", verifyToken,decryptToken, deleteMultipleNotoficationRequest);

module.exports= notificationRouter;