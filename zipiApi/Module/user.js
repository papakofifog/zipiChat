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

})

let ZipiUser=mongoose.model('User', userSchema);

async function createUser(newUser){
    try{
        let newPerson= new ZipiUser({
            firstname:newUser.firstname,
            lastname: newUser.lastname,
            username: newUser.username,
            email:newUser.email,
            password: newUser.password,
            Dob:newUser.Dob
        });
        await newPerson.save();

    }catch(e){
        console.error(e)
    }
    
}

async function findOneUser(user){
    try{
        let existingUser= await ZipiUser.findOne(user).catch((e)=>{
            next(e)
        });
        return existingUser;
    }catch(err){
        console.error(err)
    }
}

async function getAllUsers(user){
    try{
        let allUsers= await ZipiUser.find().catch((e)=>{
            next(e);
        })
        return allUsers;
    }catch(err){
        console.error(err)
    }
}

async function doesUserExist(data){
    try{
        let user=await ZipiUser.findOne(data);
        if (!user){
            return false;
        }
        return true;
    }catch(e){
        console.error(e)
    }
    
}

function checkRegisterDataformat(data){
    if (data.hasOwnProperty('firstname')===false||data.hasOwnProperty('lastname')===false|| data.hasOwnProperty('username')===false ||data.hasOwnProperty('email')===false||
    data.hasOwnProperty('password')==false|| data.hasOwnProperty('Dob')===false){
        return false
    }
    return true
}

function checkLoginDataformat(data){
    if ( data.hasOwnProperty('email')===false ||data.hasOwnProperty('password')===false){
        return false
    }
    return true
}

module.exports= { createUser,findOneUser,getAllUsers,doesUserExist,checkRegisterDataformat,checkLoginDataformat }