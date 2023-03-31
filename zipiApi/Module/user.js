//const e = require('express')
const mongoose= require('mongoose')
const pictureRoot= 'cloudinarySomething';
const toLower= require('../Util/helperfunctions');
const errorHandler= require('../Middleware/handleErrors/errorHandler');
const { friendshipSchema } = require('../Module/friendship')

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
        max_length: 50,
        unique:true,
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
    SocialMediaHandles:{
        type: Map,
        of: String
    },
    loginStatus: {
        type: Boolean,
        default: false
    }
}, {timestamps:true})


userSchema.pre('save', async function(next){
    try{
        // Check if the parent document is new
        if(this.isNew){
            // Create a new child document with the parent's ID
            const child = new friendshipSchema({
                userId: this._id,
                userFriendId: []
            })  

            // Save the child document
            await child.save();
        }
        next()
    }catch(e){
        next(e)
    }
})

let ZipiUser=mongoose.model('User', userSchema);


async function createUser(newUser,next){
    try{
        let newPerson= new ZipiUser({
            firstname:newUser.firstname,
            lastname: newUser.lastname,
            username: newUser.username,
            email:newUser.email,
            password: newUser.password,
            Dob:newUser.Dob,
            socketData:''
        });
        await newPerson.save();
    }catch(e){
        return e
    }
    
}

async function findOneUserById(userId){
    try{
        let existingUser= await ZipiUser.findById(userId).catch((e)=>{
            console.error(e)
        })
        return existingUser;
    }catch(e){
        console.error(e)
    }
}

async function findUserByUserName(username){
    try{
        let existingUser= await ZipiUser.findOne({username: username })
        return existingUser ? existingUser : null;
    }catch(e){
        console.error(e)
    }
}

async function findOneUser(user){
    try{
        let existingUser= await ZipiUser.findOne(user).catch((e)=>{
            console.error(e)
        });
        return existingUser;
    }catch(err){
        console.error(e)
    }
}

async function getAllUsers(user){
    try{
        let allUsers= await ZipiUser.find().catch((e)=>{
            next(e);
        })
        return allUsers;
    }catch(err){
        console.error(e)
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
        return errorHandler(e)
    }
    
}

function hasSameProps(obj1,obj2){
    return Object.keys(obj1).every(function (prop ){
        return obj2.hasOwnProperty(prop);
    })
}

function checkRegisterDataformat(data){
    /*return !(data.hasOwnProperty('firstname')===false||data.hasOwnProperty('lastname')===false|| data.hasOwnProperty('username')===false ||data.hasOwnProperty('email')===false||
    data.hasOwnProperty('password')===false|| data.hasOwnProperty('Dob')===false);*/
    let idealStructure= new Object({
        firstname:String,
        lastname:String,
        username:String,
        email:String,
        password:String,
        Dob:String
    }) 
    
    return hasSameProps(idealStructure,data)
    
}

function checkLoginDataformat(data){
    let idealStructure= new Object({
        email:String,
        password:String,
    })
    return hasSameProps(idealStructure,data)

}

async function updateLoginStatus(data){
    try{
        let user= await ZipiUser.findById(data.userId);
        user.loginStatus=data.status;
        await user.save();
        return true
    }catch(e){
        console.error(e)
        return false
    }
   
}

module.exports= { createUser,findOneUserById,findOneUser,getAllUsers,doesUserExist,checkRegisterDataformat,checkLoginDataformat, updateLoginStatus, findUserByUserName }