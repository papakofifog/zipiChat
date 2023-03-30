const { findOneUserById, getAllUsers }= require('../Module/user');
const { userSuccess, successMessage, failureMessage}= require('../Middleware/handleResponse');
const { getUserpicture } = require('../Module/userPictures');
const { getUserNumberFriends } = require('./friendRequest')

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
            pictures:usersPicture.userPicUrl||''
        }
        return res.status(200).json(userSuccess(returnUser));
    }catch(e){
        next(e)
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


module.exports= { getActiveUser, getAllUserSystem };


