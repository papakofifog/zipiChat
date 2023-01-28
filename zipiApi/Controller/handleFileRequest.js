require('dotenv').config();
const { success, failure, successMessage, failureMessage } = require('../Middleware/handleResponse');
const { addUserPicture, getAllpictures } = require('../Module/userPictures');
const { signuploadform } = require('../util/cloudinary');


async function AddProfilePicture(req,res,next){
    try{
        let picturePath= '/userProfiles/'+req.user+'1056_';
        let data= {
        userId:req.user,
        userPicture:picturePath
        }
        let newPictureStatus= await addUserPicture(data);
        if(newPictureStatus){
            return res.json(successMessage('Picture added succesfully', data));

        }else{
            return res.json(failure())
        }
    }catch(e){
        return next(e)
    }
    
}

async function allPictures(req,res,next){
    try{
        let userPicture= await getAllpictures();
        return userPicture;
    }catch(e){
        return next(e)
    }
}


function storeSignFile(req,res,next){
    try{
        const sig = signuploadform();
        res.json({
            signature: sig.signature,
            timestamp: sig.timestamp,
            cloudname: process.env['CLOUDNAME'],
            apikey : process.env['CLOUDSECRET']
        })

    }catch(e){
        return next(e)
    }
}


module.exports= { AddProfilePicture, allPictures, storeSignFile };

