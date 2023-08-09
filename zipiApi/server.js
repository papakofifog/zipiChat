// @ts-nocheck

require('dotenv').config();

const Server= require('socket.io');

const cors= require('cors');

const express= require('express');

const app= express();

let http= require('http');

const server= http.createServer(app);

const clients=new Map()

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

const sio = Server(server, {
        cors: {
            origin: "http://localhost:5173"
      }
    });


    function sendMessageToReceiver(clientSocket,data){
        console.log(data);
        /*console.log(clientSocket);*/
        clients.get(clientSocket).emit('receiveMessage', data)
    }

    function sendTypingStatus(clientSocket){
        clientSocket.get(clientSocket).emit('typing', 'typing...');
    }

    sio.on("connection", function(socket){
        //console.log("connected successfully")
        
        socket.on('setUserId', async (msg)=> {
            //console.log("coded message",msg)
            clients.set(msg, socket) 
        })
        // When a client sends a message
        socket.on('sendMessage', async (data)=> {
            let clientSocket= data.recipientId
            if (clients.has(clientSocket)) {
                //save chat 
                let chatData= {
                    message: data.message,
                    sender_id: data.senderId,
                    receiver_id: data.recipientId
                }
                sendMessageToReceiver(clientSocket,data);
            }else{
                
                clients.set(data.recipientId,socket);
                sendMessageToReceiver(clientSocket,data);
                
            }
    
        });

        socket.on('typing', (receipientId)=>{
            let clientSocket=receipientId;
            if (clients.has(clientSocket)){
                
                sendTypingStatus(receipientId);
            }else{
                clients.set(receipientId,socket);
                sendTypingStatus(receipientId);
            }
        })
    });


server.listen(process.env.PORT);

module.exports=server;




