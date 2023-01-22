require('dotenv').config();

const axios = require('axios');

const tokenEndpoint = 'https://oauth2.googleapis.com/token';


async function getAccessToken(code) {
  const data = {
    code,
    client_id: process.env['googleClientId'],
    client_secret: process.env['clientSecret'] ,
    redirect_uri: process.env['redirectUri'],
    grant_type: 'authorization_code',
  };

  try {
    const response = await axios.post(tokenEndpoint, data);
    return response.data.access_token;
  } catch (error) {
    console.error(error);
  }
}



