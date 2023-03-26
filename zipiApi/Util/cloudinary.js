require('dotenv').config();

const cloudinary = require('cloudinary').v2;
const path = require('path');

cloudinary.config({
    cloud_name: process.env.CLOUDNAME,
    api_key: process.env.CLOUDKEY,
    api_secret: process.env.CLOUDKEYSECRET
});



const uploadFileCloud = (req, callback) =>{
    const filePath= 'userProfiles/'+req.user+'1056_'+req.file.originalname
    cloudinary.uploader.upload(filePath, {resource_type: "raw"}, function(error, result) {
        if (error) {
          console.error('Failed to upload file to Cloudinary:', error);
        } else {
          callback(error, result);
        }
        
      });
}


module.exports= { uploadFileCloud };

