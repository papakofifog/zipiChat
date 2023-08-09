const mongoose= require('mongoose');


const userPictureSchema= new mongoose.Schema({
    userId:{
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'user',
    },
    userPicUrl: {
        type:String,
        required: false,
    }
});

const UserPicture= mongoose.model('Upictures', userPictureSchema);



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
        
        let currentUserPicture= await getUserpicture(data.userId);

        console.log(data.picURl)

        currentUserPicture.userPicUrl=data.picURl;

        await currentUserPicture.save();

        let newCurrentUserPicture= await getUserpicture(data.userId);
        return newCurrentUserPicture?true:false;
        
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

module.exports= { UserPicture, getUserpicture, updateUserPicture, getAllpictures };