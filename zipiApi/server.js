// @ts-nocheck

require('dotenv').config();

const Server= require('socket.io');

const cors= require('cors');

const express= require('express');

const app= express();

let http= require('http');

const server= http.createServer(app);

app.use('/userProfiles',express.static(__dirname+'/userProfiles'))

app.use(cors({origin:'http://localhost:5173'}));



//const { registerWithGoogle } = require('./Controller/applicationRequest');

const dbConnection= require('./Settings/connectToDb');

const errorHandler= require('./Middleware/handleErrors/errorHandler');

const bodyParser= require('body-parser') 



const AppRouter = require('./routes/applicationRoutes');

const ChatRouter= require('./routes/chatRoutes')

const UserRouter = require('./routes/userRoutes');

const FriendRouter = require('./routes/friendRoutes');

const MailRouter= require('./routes/emailRoutes');

const SocketRouter= require('./routes/socketEvents')

// express middle ware to handle geting json data
app.use(bodyParser.json())



//connect to the db
dbConnection()

//application routes
app.use('/api',AppRouter);

//user request routes
app.use('/users', UserRouter);

// chat routes
app.use('/convo',ChatRouter);

//friend routes
app.use('/friend', FriendRouter);

//email routes
app.use('/email', MailRouter);



// handle errors
app.use(errorHandler);


server.listen(process.env.PORT);

module.exports=server;




