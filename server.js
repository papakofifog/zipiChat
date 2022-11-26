const express= require('express');
const chatApp= express();
require('dotenv').config();
const cors= require('cors');
const dbConnection= require('./Settings/connectToDb');

chatApp.use(cors())

// chat app routes

//connect to the mongoose database
dbConnection()

chatApp.listen(process.env['PORT'], ()=>{
    console.log(`Chat app running on http://localhost:${process.env['PORT']}`);
})