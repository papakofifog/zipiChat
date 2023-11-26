const mongoose= require('mongoose');

const notificationsSchema = new mongoose.Schema({
    receipientUsername:{
        type: String,
        required:(true, "friend username is required")
    },
    message:{
        type: String,
        required:(true, "message is required")
    },
    senderId:{
        type: mongoose.Types.ObjectId,
        ref:'user',
    }
}, {timestamps:true});


let ZipiUserNotification= mongoose.model('notifications', notificationsSchema);

async function createNotification(newNotificationData){
    try{
        let notification= new ZipiUserNotification({
            receipientUsername: newNotificationData.receipientUsername,
            message:newNotificationData.message,
            senderId:newNotificationData.senderId
        })
        
        notification.save();
        
    }catch(e){
        return(e);
    }
}

async function findOneNotificationById(notificationId){
    try{
        let existingNotification= await ZipiUserNotification.findById(notificationId).catch((e)=>{
            console.error(e);
        })
        return existingNotification;
    }catch(e){
        console.error(e);
    }
    
}

async function getAllNotification(data){
    try{
        let userNotification= await ZipiUserNotification.find({receipientUsername:data?.username}).catch((e)=>{
            console.error(e);
        });
        return userNotification;
    }catch(e){
        console.error(e);
    }
}

async function deleteOneNotifcation(notificationId){
    try{
        let isNotificationDeleted=await ZipiUserNotification.findByIdAndDelete({_id:notificationId});
        return isNotificationDeleted;
    }catch(e){
        console.error(e)
    }
}

async function deleteMultipleNotification(notificationIds){
    try{
        let {deletedCount}= await ZipiUserNotification.deleteMany(notificationIds)
        return Boolean(deletedCount);
    }catch(e){
        console.error(e);
    }
}


module.exports= { createNotification, getAllNotification, deleteOneNotifcation, deleteMultipleNotification, findOneNotificationById }