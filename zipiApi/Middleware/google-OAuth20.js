require('dotenv').config()
const {OAuth2Client} = require('google-auth-library');
const { failureMessage } = require('./handleResponse')

function verifyGoogleAccessToken(req,res,next){
    let googleToken= req.body.headers.authorization || req.query.token || req.headers.authorization
    //console.log(req)
    if(!(googleToken)) return res.json(failureMessage('Authorization Token needed'))
    const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
    async function verify() {

      const ticket = await client.verifyIdToken({
          idToken: googleToken,
          audience: process.env.GOOGLE_CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
          // Or, if multiple clients access the backend:
          //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
      });
      const payload = ticket.getPayload();
      const userid = payload['sub'];
      // If request specified a G Suite domain:
      // const domain = payload['hd'];

      
    }
    verify().then((data)=>{
        res.status(200).json(data)
    }).catch((e)=>{
        next(e)
    });


    
}


module.exports= verifyGoogleAccessToken
