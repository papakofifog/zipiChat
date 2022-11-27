const express= require('express');

const { registerUser, loginWithJWT } = require('../Controller/userRegistration');

const routeUser= express.Router();


routeUser.post("/signUp", registerUser);
routeUser.post("/login",loginWithJWT);


module.exports = routeUser;