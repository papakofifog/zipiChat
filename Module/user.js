const e = require('express')
const mongoose= require('mongoose')
const pictureRoot= 'cloudinarySomething'
const userSchema= new mongoose.Schema({
    userName:{
        type: String,
        required: (true, "username requred"),
        max_length: 50
    },
    email: {
        type: String,
        set: toLower,
        required: (true,"email required"),
        max_length:255
    },
    Dob:{
        type: String,
        required: (true, "Your Date of birth is required"),
    },
    SocialMeadiaHnadles:{
        type: Map,
        of: String
    },
    userPictures: [{url:String}] 
})

const toLower=(e)=>{
    return e.toLowerCase()
}

userSchema.path('userPicture.0.url').get(v=> `${pictureRoot}${v}`);