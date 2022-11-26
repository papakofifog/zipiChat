const express= require('express');
const chatApp= express();
require('dotenv').config();
const cors= require('cors');
const dbConnection= require('./Settings/connectToDb');
const errorHandler= require('./Middleware/handleErrors/errorHandler');

chatApp.use(cors())
chatApp.use(express.json)

// chat app routes
chatApp.use('/api/', registeUser)



// handle errors
chatApp.use(errorHandler);

//connect to the mongoose database
dbConnection()

chatApp.listen(process.env['PORT'], ()=>{
    console.log(`Chat app running on http://localhost:${process.env['PORT']}`);
})