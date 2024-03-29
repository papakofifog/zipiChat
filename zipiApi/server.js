require('dotenv').config();

const cors= require('cors');

const express= require('express');

const app= express();

let http= require('http');

const server= http.createServer(app);

const clients=new Map()

app.use(cors({origin:'http://localhost:8000'}));

//const { registerWithGoogle } = require('./Controller/applicationRequest');

const dbConnection= require('./Settings/connectToDb');

const errorHandler= require('./Middleware/handleErrors/errorHandler');

const bodyParser= require('body-parser') 

const AppRoute = require('./routes/applicationRoutes');

const ChatRouter= require('./routes/chatRoutes')

const UserRoute = require('./routes/userRoutes');

app.use(bodyParser.json())

app.use('/userProfiles',express.static(__dirname+'/userProfiles'))

//connect to the db
dbConnection()

//application routes
app.use('/api',AppRoute);

//user request routes
app.use('/users', UserRoute);

// chat routes
app.use('/convo',ChatRouter);

// handle errors
app.use(errorHandler);



const sio = require("socket.io")(server, {
    handlePreflightRequest: (req, res) => {
        const headers = {
            "Access-Control-Allow-Headers": "Content-Type, Authorization",
            "Access-Control-Allow-Origin": req.headers.origin, //or the specific origin you want to give access to,
            "Access-Control-Allow-Credentials": true
        };
        res.writeHead(200, headers);
        res.end();
    }
});


function sendMessageToReceiver(clientSocket,data){
    clients.get(clientSocket).emit('receiveMessage', data)
}

sio.on('connection', function(socket){


    socket.on('setUserId', async (msg)=> {
        clients.set(msg, socket) 
    })
    // When a client sends a message
    socket.on('sendMessage', async (data)=> {
        // check if the recipient is connected to the server
        console.log(data)
        //let client= await getUserSocket(data);
        let clientSocket= data.recipientId
        if (clients.has(clientSocket)) {
            //save chat 
            let chatData= {
                message: data.message,
                sender_id: data.senderId,
                receiver_id: data.recipientId
            }
            
            sendMessageToReceiver(clientSocket,data)
        }else{
            
            clients.set(data.recipientId,socket);
            
        }
 
    });
});




server.listen(process.env.PORT);




