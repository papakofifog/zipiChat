const multer= require('multer');
const path= require('path');
const filestorage = multer.diskStorage({
    // destination to store uploaded picture
    destination: 'userProfiles',
    filename: (req, file, cb)=> {
        cb(null, req.user+'1056_'+ path.extname(file.originalname));
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
    fileFileter(req, file, cb){
        if(file.originalname.match(/^$/)){
            //uplade on png and jpg format
            return cb(new Error('Please upload a file'))
        }
        cb(undefined, true)
    }
})

module.exports= fileUpload;