const { findOneUserById, getAllUsers }= require('../Module/user');
const { userSuccess, successMessage, failureMessage}= require('../Middleware/handleResponse');
const { getUserpicture, updateUserPicture} = require('../Module/userPictures');
const { getUserNumberFriends } = require('./friendRequest');
const { encryptedPassword} = require("../Middleware/encryptData")

async function getActiveUser(req,res,next){
    try{
        let userId= req.body['id'];
        let user= await findOneUserById(userId).catch((e)=>{
            next(e);
        })

        let numberOfFriends= await getUserNumberFriends(userId).catch((e)=>{
            next(e)
        })

        let usersPicture= await getUserpicture(userId);
        
        let returnUser= {
            firstname: user.firstname,
            lastname: user.lastname,
            username: user.username,
            email: user.email,
            Dob:user.Dob,
            friendCount: numberOfFriends,
            picture:usersPicture.userPicUrl||''
        }
        return res.status(200).json(userSuccess(returnUser));
    }catch(e){
        next(e)
    }
    
}

async function getActiveUsersPictureRequest(req,res,next){
    try{
        let usersPicture= await getUserpicture(req.body['id']);
        res.status(200).json(successMessage("Users picture Url is", usersPicture));
    }catch(e){
        next(e);
    }
    
}

async function getAllUserSystem(req,res, next){
    try{
        let users= await getAllUsers();
        if (!users){
            return res.json(failureMessage("No user exist"))
        }
        return res.json(successMessage("Users are ", users))

    }catch(e){
        return next(e)
    }
}

async function updateActiveUserData(req,res,next){
    try{
        let userId= req.body['id'];
        let user= await findOneUserById(userId).catch((e)=>{
            next(e);
        })
        user.firstname= req.body.firstname.trim();
        user.lastname= req.body.lastname.trim();
        user.Dob= req.body.Dob.trim();
        await user.save();
        let newUser= await findOneUserById(userId);
        res.status(201).send(successMessage("user Updated", newUser))

    }catch(e){
        next (e)
    }
}

async function updateUserPictureRequest(req, res,next){
    try{
        let status=false;
        
        status= await updateUserPicture({userId:req.body['id'], picURl:req.body.picURL})
        
        return status? res.status(201).json(successMessage("PictureUpdated")): res.status(404).json(failureMessage("Picture Update Failed"))
    }catch(e){
        next(e);
    }
    
} 

async function handlePasswordUpdate(req, res, next){
    try{
        let userId= req.body['id'];
        let user= await findOneUserById(userId);
        if(!user)return res.status(400).json(failureMessage("User does not exist"));
        let newPassword= await encryptedPassword(req.body.password);
        user.password= newPassword;
        let updatedUser=await user.save();
        return updatedUser? res.status(200).json(successMessage("Passoword updated succesfully")):res.status(400).json(failureMessage("Password update failed"));
    
    }catch(e){
        next(e);
    }

}


module.exports= { getActiveUser, getAllUserSystem, updateActiveUserData, updateUserPictureRequest, getActiveUsersPictureRequest, handlePasswordUpdate };


