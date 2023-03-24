require('dotenv').config();

const cors= require('cors');
const express= require('express');
const app= express();


let http= require('http');
const server= http.createServer(app);


const clients=new Map()


app.use(cors({
    origin:'http://localhost:8000'
}));



//const { registerWithGoogle } = require('./Controller/applicationRequest');

const dbConnection= require('./Settings/connectToDb');

const errorHandler= require('./Middleware/handleErrors/errorHandler');

const bodyParser= require('body-parser') 

const AppRoute = require('./routes/applicationRoutes');

const ChatRouter= require('./routes/chatRoutes')
const {updateReadStatusOfOneChat} = require('./Module/chat')


const { getAllUsers } = require('./Module/user');
const UserRoute = require('./routes/userRoutes');

const { updateUserData, getUserSocket } = require('./Module/user');
const passport = require('passport');

app.use(bodyParser.json())
app.use('/userProfiles',express.static(__dirname+'/userProfiles'))

//connect to the db
dbConnection()

app.get('/home', (req,res)=>{
    console.log("hey")
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

// handle errors
app.use(errorHandler);

//Add authentication routes
app.use('/auth', AppRoute)





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

/*sio.on('connection', function( socket ) {
        // add event listeners here
        //console.log(socket.id)
});*/

function sendMessageToReceiver(clientSocket,data){
    clients.get(clientSocket).emit('receiveMessage', data)
}

sio.on('connection', function(socket){


    socket.on('setUserId', async (msg)=> {
        clients.set(msg, socket) 
    })
    //Asign a unique ID to the client and store it

    //const clientId=generateUniqueId();
    //clients[clientId] = socket;
    //console.log(clients)
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
            // see message sent
            //console.log(clients.get(clientSocket))
            // Send the message to the recipient 
            //clients.get(clientSocket).emit('receiveMessage', data)
            //update the read status of the message to true.
            
            sendMessageToReceiver(clientSocket,data)
            //let clientSocket= client.socketData;
            //clientSocket.emit('receiveMessage',data)
            //console.log("Moo")
        }else{
            // current User does not have a socket.
            clients.set(data.recipientId,socket);
            //updateReadStatusOfOneChat(data.senderId,data.recipientId,)
            //sendMessageToReceiver(clientSocket,data)
            //console.log('noUser',data)
        }

        // if userId does not exist
        
    });
});




server.listen(process.env.PORT);




