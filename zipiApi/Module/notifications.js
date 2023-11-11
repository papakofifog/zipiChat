const mongoose= require('mongoose');

const notificationsSchema = new mongoose.Schema({
    notificationId:{
        type: mongoose.Types.ObjectId,
        unique: true,
        required: (true, "notification reference is required")
    },
    senderUsername:{
        type: String,
        required: (true, "senderUsername is required")
    },
    receipientUsername:{
        type: String,
        required:(true, "friend username is required")
    }
}, {timestamps:true});


let ZipiUserNotification= mongoose.model('Notification', notificationsSchema);

async function createNotification(newNotificationData){
    try{
        let newNotification= new ZipiUserNotification({
            senderUsername:newNotificationData.activeUserName,
            receipientUsername: newNotificationData.friendUserName  
        })
        await newNotification.save();
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
        let userNotification= await ZipiUserNotification.find({friendUserName:data?.username}).catch((e)=>{
            console.error(e);
        });
        return userNotification;
    }catch(e){
        console.error(e);
    }
}

async function deleteOneNotifcation(notificationId){
    try{
        let {deleteOne}=await ZipiUserNotification.deleteOne({notificationId:notificationId})
        return Boolean(deleteOne);
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