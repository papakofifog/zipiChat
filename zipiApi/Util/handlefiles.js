require('dotenv').config();

const multer= require('multer');
const path= require('path');
const { uploadFileCloud } = require('../util/cloudinary');


const filestorage = multer.diskStorage({
    // destination to store uploaded picture
    destination: 'userProfiles',
    filename: (req, file, cb)=> {
        //console.log(req.file)
        cb(null, req.user+'1056_'+file.originalname)
        //console.log(path.extname(file.originalname))
        //req.user.fielExtension=path.extname(file.originalname);
        
        // where file.filename is name of the field (image)
        // path.extname get the uploaded file extention
    }
})


const fileUpload = multer({
    storage: filestorage,
    limits: {
        fileSize: 1000000 // 1000000 Bytes = 1MB
    },
    fileFileter(req, file, next){
        if(file.originalname.match(/^$/)){
            //uplade on png and jpg format
            return cb(new Error('Please upload a file'))
        }
        return next;
    }
})

module.exports= fileUpload;