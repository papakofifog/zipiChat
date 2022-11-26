const e = require('express')
const mongoose= require('mongoose')
const pictureRoot= 'cloudinarySomething'
const userSchema= new mongoose.Schema({
    userName:{
        type: String,
        required: (true, "username is requred"),
        max_length: 50
    },
    email: {
        type: String,
        set: toLower,
        required: (true,"email is required"),
        max_length:255
    },
    password: {
        type: String,
        required:( true , "password is required")
    },
    Dob:{
        type: String,
        required: (true, "Your Date of birth is required"),
    },
    SocialMediaHnadles:{
        type: Map,
        of: String
    },
    userPictures: [{url:String}],
    token:{
        type:String
    }

})

const toLower=(e)=>{
    return e.toLowerCase()
}

userSchema.path('userPicture.0.url').get(v=> `${pictureRoot}${v}`);

module.exports= mongoose.model('User', userSchema);