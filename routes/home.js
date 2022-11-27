const express= require('express');
const showHomePage = require('../Controller/applicationRequest');
const { verifyToken } = require('../Middleware/JWT');
const homeRoute= express.Router();

homeRoute.post('/welcome',verifyToken, showHomePage)

module.exports= homeRoute;