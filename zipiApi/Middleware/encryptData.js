const bcrypt= require('bcrypt');

async function encryptedPassword(password){
    let salt= await bcrypt.genSalt(11);
    let encryptedpassword= await bcrypt.hash(password,salt);
    return encryptedpassword;
}

async function verifyPassword(incomingPassword,existingPassword){
    let isPasswordVerified=await bcrypt.compare(incomingPassword,existingPassword).catch((e)=>{
        next(e);
    });
    return isPasswordVerified;
}

module.exports= { encryptedPassword, verifyPassword };