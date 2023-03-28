require('dotenv').config();

const cloudinary = require('cloudinary').v2;
const path = require('path');

cloudinary.config({
    cloud_name: process.env.CLOUDNAME,
    api_key: process.env.CLOUDKEY,
    api_secret: process.env.CLOUDKEYSECRET
});



const uploadFileCloud = (req, callback) =>{
    const filePath= 'userProfiles/'+req.file.originalname
    cloudinary.uploader.upload(filePath, {resource_type: "raw"}, function(error, result) {
        if (error) {
          console.error('Failed to upload file to Cloudinary:', error);
        } else {
          result.fileType=req.file.mimetype;
          result.FileName=req.file.orginalFileName;
          callback(error, result);
        }
        
      });
}


module.exports= { uploadFileCloud };

