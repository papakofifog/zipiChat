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

const verifyToken = async (req,res,next) =>{
    try{
        const  token= req.body.token || req.query.token || req.headers['access-token'];
        if(!token)return res.status(403).json("A token authentication is needed");
        const decode= await verify(token, process.env['JWTSECRET']);
        
        req.user= decode;
    }catch(err){
        next(err)
    }
    return next();
    
}



module.exports= { createToken, verifyToken };