require('dotenv').config();
const express= require('express');
const app= express();

const cors= require('cors');

const dbConnection= require('./Settings/connectToDb');

const errorHandler= require('./Middleware/handleErrors/errorHandler');

const bodyParser= require('body-parser') 

const AppRoute = require('./routes/applicationRoutes');

const { getAllUsers } = require('./Module/user')

app.use(cors())
app.use(bodyParser.json())

app.get('/', (req,res)=>{
    res.sendFile(__dirname+'/View/views/index.html')
})

//application routes
app.use('/api',AppRoute);
app.get('/admin/allUsers', async (req,res)=>{
    return res.json( await getAllUsers());
})



app.use(errorHandler);

//connect to the db
dbConnection();

app.listen(process.env['PORT'], ()=>{
    console.log(`Chat app running on http://localhost:${process.env['PORT']}`);
})