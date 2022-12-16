require('dotenv').config();

const cors= require('cors');
const express= require('express');
const app= express();

app.use(cors({
    origin:'http://localhost:8000'
}));





const dbConnection= require('./Settings/connectToDb');

const errorHandler= require('./Middleware/handleErrors/errorHandler');

const bodyParser= require('body-parser') 

const AppRoute = require('./routes/applicationRoutes');

const ChatRouter= require('./routes/chatRoutes')



const { getAllUsers } = require('./Module/user');
const UserRoute = require('./routes/userRoutes');

app.use(bodyParser.json())
app.use('/userProfiles/',express.static('./userProfiles/'))

//connect to the db
dbConnection()

app.get('/', (req,res)=>{
    res.sendFile(__dirname+'/view')
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

let http= require('http');

const server= http.createServer(app);


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


sio.on('connection', function(socket){
    
    socket.on('message', message=> console.log(message))
})


server.listen(process.env.PORT);




