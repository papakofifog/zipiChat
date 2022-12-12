require('dotenv').config();
const { sign, verify,}= require('jsonwebtoken');
const decodeJwtT= require('jwt-decode');


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
        const  token= req.body.token || req.query.token || req.headers['authorization'];
        if(!token)return res.status(403).json("A token authentication is needed");
        const decode= await verify(token, process.env['JWTSECRET']);
    }catch(err){
        next(err)
    }
    return next();
    
}


const decryptToken = async(req,res,next)=>{
    try{
        let token= req.headers['authorization'];
        
        let codeBreakdown= await decodeJwtT(token);

        req.body['id']=codeBreakdown.id;
        return next()
    }catch(e){
        next(e)
    }
    
}


module.exports= { createToken, verifyToken, decryptToken };





