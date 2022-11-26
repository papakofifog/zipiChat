require('dotenv').config();
const { sign, verify}= require('jsonwebtoken');

const createToken= (user) =>{
    const accessToken = sign(
        { id: user._id, username:user.username },
        process.env['JWTSECRET'],
        {
            expiresIn:"2h",
        }
    );
    return accessToken;
}

const validateToken = (req,res,next) =>{
    const accessToken= req.headers.cookie;
    const  result
}