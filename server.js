require('dotenv').config();
const express= require('express');
const app= express();

const cors= require('cors');

const dbConnection= require('./Settings/connectToDb');

const errorHandler= require('./Middleware/handleErrors/errorHandler');

const bodyParser= require('body-parser') 

const routeUser= require('./routes/userRoutes');
const homeRoute = require('./routes/home');


app.use(bodyParser.json())

app.get('/', (req,res)=>{
    res.sendFile(__dirname+'/View/views/index.html')
})

//application routes
app.use('/api',routeUser);
app.use('/api',homeRoute);



app.use(errorHandler);

//connect to the db
dbConnection();

app.listen(process.env['PORT'], ()=>{
    console.log(`Chat app running on http://localhost:${process.env['PORT']}`);
})