const { successMessage,failureMessage, userSuccess } = require("../Middleware/handleResponse");
const {createNotification,deleteOneNotifcation,deleteMultipleNotification, getAllNotification} =require("../Module/notifications");
const { findOneUserById } = require("../Module/user");

async function saveNotification(req,res,next){
    try{
        let newNotification= await createNotification(req.body);
        return newNotification?res.status(200).json(successMessage("Notification saved")):res.status(400).json(failureMessage("Failed to save notification"));
    }catch(e){
        return next(e);
    }
}

async function getAllUserNotificationRequest(req,res,next){
    try{
        let activeUserName= await findOneUserById(req.body['id']);
        let data= {username: activeUserName?.username}
        let userNotifications= await getAllNotification(data);
        return res.status(200).json(userSuccess(userNotifications));
    }catch(e){
        return next(e);
    }
}

async function deleteOneNotificationRequest(req,res,next){
    try{
        let isNotificationDeleted= await deleteOneNotifcation(req.body);
        return isNotificationDeleted?res.status(200).json(successMessage("Notification deleted")):res.status(400).json(failureMessage("Failed to delete notification"));
    }catch(e){
        return next(e);
    }
}

async function deleteMultipleNotoficationRequest(req,res,next){
    try{
        let isNotificationDeleted= await deleteMultipleNotification(req.body.notifications);
        return isNotificationDeleted?res.status(200).json(successMessage("Notifications deleted")):res.status(400).json(failureMessage("Failed to delete notifications"));
    }catch(e){
        return next(e);
    }
}


module.exports= {saveNotification,getAllUserNotificationRequest, deleteOneNotificationRequest, deleteMultipleNotoficationRequest}
