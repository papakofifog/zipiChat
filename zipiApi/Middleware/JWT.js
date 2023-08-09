require('dotenv').config();
const { sign, verify,}= require('jsonwebtoken');
const decodeJwtT= require('jwt-decode');


const createToken= (user) =>{
    const accessToken = sign(
        { id: user._id },
        process.env['JWTSECRET'],
        {
            expiresIn:"5h",
        }
    );
    return accessToken;
}

const createEmailToken= (user)=>{
    const accessToken= sign(
        {id: user._id},
        process.env['JWTSECRET'],
        {
            expiresIn: "15mins"
        }
    )
    return accessToken;
}

const verifyToken = async (req,res,next) =>{
    try{
        const  token= req.body.token || req.query.token || req.headers['authorization'];
        if(!token)return res.status(403).json("A token authentication is needed");
        let newToken= token.slice(7,token.length);
        verify(newToken, process.env['JWTSECRET']);
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
        req.user=codeBreakdown.id;
        return next()
    }catch(e){
        next(e)
    }
    
}


module.exports= { createToken, createEmailToken, verifyToken, decryptToken };





