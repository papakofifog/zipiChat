require('dotenv').config();
const express= require('express');
const app= express();
const http= require('http').Server(app);
const io = require('socket.io')(http);

const cors= require('cors');

const dbConnection= require('./Settings/connectToDb');

const errorHandler= require('./Middleware/handleErrors/errorHandler');

const bodyParser= require('body-parser') 

const AppRoute = require('./routes/applicationRoutes');

const ChatRouter= require('./routes/chatRoutes')



const { getAllUsers } = require('./Module/user');
const UserRoute = require('./routes/userRoutes');



app.use(cors())
app.use(bodyParser.json())


//connect to the db
dbConnection()

app.get('/', (req,res)=>{
    res.sendFile(__dirname+'/View/views/index.html')
})

//application routes
app.use('/api',AppRoute);
app.get('/admin/allUsers', async (req,res)=>{
    return res.json( await getAllUsers());
})

//user request routes
app.use('/users', UserRoute);

// chat routes
app.use('/convo',ChatRouter);



app.use(errorHandler);



http.listen(process.env['PORT'], ()=>{
    console.log(`Chat app running on http://localhost:${process.env['PORT']}`);
})