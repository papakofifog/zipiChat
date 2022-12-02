const bcrypt= require('bcrypt');

async function encryptedPassword(password){
    let salt= await bcrypt.genSalt(11);
    let encryptedpassword= await bcrypt.hash(password,salt);
    return encryptedpassword;
}

async function verifyPassword(existingPassword,incomingPassword){
    let isPasswordVerified=await bcrypt.compare(existingPassword, incomingPassword).catch((e)=>{
        next(err);
    });
    return isPasswordVerified;
}

module.exports= { encryptedPassword, verifyPassword };