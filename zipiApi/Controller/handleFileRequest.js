require('dotenv').config();
const { success, failure, successMessage, failureMessage } = require('../Middleware/handleResponse');
const { addUserPicture, getAllpictures } = require('../Module/userPictures');
const { uploadFileCloud } = require('../util/cloudinary');


async function AddProfilePicture(req,res,next){
    try{
        let picturePath= 'userProfiles';
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
        uploadFileCloud(req, function(error,result){
            if(error){
                res.status(500).send('Failed to upload file to Cloudinary')

            }else{
                res.send(successMessage('File uploaded to Cloudinary', result))
            }
        });

        //res.send(successMessage("The file Object recieved is ", req.file))

    }catch(e){
        return console.error(e)
    }
}





module.exports= { AddProfilePicture, allPictures, storeSignFile };

