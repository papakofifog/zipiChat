require('dotenv').config();

const cloudinary = require('cloudinary').v2;
const path = require('path');

cloudinary.config({
    cloud_name: process.env.CLOUDNAME,
    api_key: process.env.CLOUDKEY,
    api_secret: process.env.CLOUDKEYSECRET
});



const uploadFileCloud = (req, callback) =>{
    //console.log(file)
    //const filePath = req.user+'1056_'+path.join(__dirname, req.file.originalname);
    const filePath= 'userProfiles/'+req.user+'1056_'+ path.extname(req.file.originalname);
    cloudinary.uploader.upload(filePath, function(error, result) {
        if (error) {
          console.error('Failed to upload file to Cloudinary:', error);
        } else {
          //console.log('File uploaded to Cloudinary:', result);
          callback(error, result);
        }
        
      });
}


module.exports= { uploadFileCloud };

