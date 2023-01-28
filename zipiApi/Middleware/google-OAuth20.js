require('dotenv').config();

const axios = require('axios');

const tokenEndpoint = 'https://oauth2.googleapis.com/token';


async function getAccessToken(code) {
  const data = {
    code,
    client_id: process.env['GOOGLE_CLIENT_ID'],
    client_secret: process.env['GOOGLE_CLIENT_SECRET'] ,
    redirect_uri: process.env['REDIRECTURL'],
    grant_type: 'authorization_code',
  };

  try {
    const response = await axios.post(tokenEndpoint, data);
    return response.data.access_token;


  } catch (error) {
    console.error(error);
  }
}

async function handleGetAccessToken(req,res,next){
  console.log(req.body)
  
}

module.exports= {handleGetAccessToken}

