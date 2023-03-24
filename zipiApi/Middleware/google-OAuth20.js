require('dotenv').config();

const { registerUserGoogleAuth } = require('../Controller/applicationRequest');

const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/google/callback"
  },
  async function(accessToken, refreshToken, profile, done) {

    await registerUserGoogleAuth(profile, function(err,user){
      return done(err, user)
    })
  }
));


function SignUpwithGoogle(req,res,next){
 
  passport.authenticate('google', { scope: ['openid'] })
  
}

function getGoogleUserData(req,res,next){
  console.log(req);
  passport.authenticate('google', {failureRedirect: 'http://localhost:3000/login.html'},
    function(req,res){
      return next
    }
  )
    
}

module.exports = { SignUpwithGoogle, getGoogleUserData}

