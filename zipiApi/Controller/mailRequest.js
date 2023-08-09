require('dotenv').config()
const { failureMessage, successMessage } = require("../Middleware/handleResponse");
const {findUserByEmail} = require("../Module/user");
const nodeMailer = require('nodemailer');
const EmailsTemplate= require('../Util/passwordReset');
const {createEmailToken} = require('../Middleware/JWT');







function generateResetPasswordEmailLink(user){
    let token= createEmailToken(user)
    let link=`http://localhost:5173/passwordReset?user=${token}`
    return link;
}


async function handleSendUserEmailNotification(req, res, next){
    try{
        let user= await findUserByEmail(req.body);
        if(!user) return res.status(400).json(failureMessage("Email does not exist"));
        let emailLink= generateResetPasswordEmailLink(user)
        let emailContent= EmailsTemplate(emailLink,user.firstname);
        let sentStatus= await sendMailWithNodeMailer(req.body.email, emailContent, next);
    
        return sentStatus? res.status(250).json(successMessage("Email was sent Successfully")): res.status(400).json(failureMessage("Email was not sent"));
    }catch(e){
        next(e)
    }
    
}

//console.log(process.env.EMAIL, process.env.EMAILPASSWORD)
async function sendMailWithNodeMailer(receipientEmail, emailContent , next){
    let status=false;
    let transporter= nodeMailer.createTransport({
        service: "gmail",
        auth:{
            user:process.env.EMAIL,
            pass:process.env.EMAILPASSWORD,
        }
    })

    let message = {
        from: process.env.EMAIL,
        to: receipientEmail,
        subject: "Password Reset Request",
        html: emailContent
    }

    try{
        const info= await transporter.sendMail(message);
        status=true;
        return status;
    }catch(error){
        next(error);
    }

}



module.exports={handleSendUserEmailNotification}