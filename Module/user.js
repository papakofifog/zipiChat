const e = require('express')
const mongoose= require('mongoose')
const pictureRoot= 'cloudinarySomething';
const toLower= require('../Util/helperfunctions')


const userSchema= new mongoose.Schema({
    firstname:{
        type: String,
        required: (true, "firstname is requred"),
        max_length: 50

    },
    lastname:{
        type: String,
        required: (true, "lastname is requred"),
        max_length: 50

    },
    username:{
        type: String,
        required: (true, "username is requred"),
        max_length: 50,
        unique: true

    },
    email: {
        type: String,
        set: toLower,
        required: (true,"email is required"),
        max_length:255,
        unique: true
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



//userSchema.path('userPicture.0.url').get(v=> `${pictureRoot}${v}`);

module.exports= mongoose.model('User', userSchema);