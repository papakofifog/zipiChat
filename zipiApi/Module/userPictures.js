const mongoose= require('mongoose');


const userPictureSchema= new mongoose.Schema({
    userId:{
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'user',
    },
    userPicUrl: {
        type:String,
        required: true,
        unique: true
    }
});

const UserPicture= mongoose.model('Upictures', userPictureSchema);

async function addUserPicture(data){
    try{
        let newUserPicture= new UserPicture({
            userId: data.userId,
            userPicUrl: data.userPicture
        });

        let picture= await UserPicture.findOne({userPicUrl:newUserPicture.userPicUrl});
        if(picture===null){
            await newUserPicture.save();
            return true;
        }else{
            
            return false;
        }
    }catch(e){
        return e;
    }
    
}

async function getUserpicture(userId){
    let usePicture= await UserPicture.findOne({userId:userId});
    if(usePicture===null){
        return false;
    }else{
        return usePicture;
    }
}

async function updateUserPicture(data){
    try{
        let currentUserPictureId= data.userId;
        let currentUserPicture= await UserPicture.findOne({userId:userId}).catch((e)=>{
            return new Error(e)
        });
        if(currentUserPicture){
            let newUserPicture= data.newUploadedPicture;
            currentUserPicture.userPicUrl= newUserPicture;
            await currentUserPicture.save().catch((e)=>{
                return new Error(e)
            }

            );
            return true;
        }else{
            return false
        }
    }catch(e){
        return e;
    }
}

async function getAllpictures(){
    let allpictures=UserPicture.find().catch((e)=>{
        return e;
    })
    return allpictures;
}

module.exports= { addUserPicture, getUserpicture, updateUserPicture, getAllpictures };