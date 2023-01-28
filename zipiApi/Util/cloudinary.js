require('dotenv').config();

const cloudinary = require('cloudinary').v2;


cloudinary.config({
    cloud_name: process.env.CLOUDNAME,
    api_key: process.env.CLOUDKEY,
    api_secret: process.env.CLOUDKEYSECRET
});

const signuploadform = () =>{
    let timestamp = Math.random((new Date).getTime()/1000);

    let signature = cloudinary.utils.api_sign_request({
        timestamp: timestamp,
        eager: 'c_pad,h_300,w_400|c_crop,h_200,w_260',
        folder: 'zipiChat_uploads'
    },
    cloudinary.config().api_secret);

    return { timestamp , signature }
}


module.exports= { signuploadform };

