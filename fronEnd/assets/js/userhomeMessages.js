import { sendData } from "./handleRequest.js";
let chatsView = document.querySelector('#messages');
let messageToBeSent= document.querySelector('#input')
let sendMessageButton= document.querySelector('#sendMessage')
let chatTitle= document.querySelector('#chat-name')
let userProfileContainer= document.querySelector('#userEverything')
//userProfileContainer.childNodes[0].id

//console.log()


function creatList(data){
    console.log(data.sender_id === userProfileContainer.childNodes[0].id)
    let listClass='receiver';
    if (data.senderId=== userProfileContainer.childNodes[0].id ){
        listClass='sender';
    }
   
    let messageList=`<div class=${listClass}> <li class='messageList'>${data.message}</li></div>`;
    return messageList;
    
    
}

let accessToken= window.sessionStorage.getItem('access-token');
const socket = io.connect(`http://localhost:3000`);


/*setTimeout(function sendUserId(){
    socket.emit('setUserId', );
},4000);*/


function ConnectWitChatServer(){
    socket.emit('setUserId', userProfileContainer.childNodes[0].id)

}

function showMessagePerUser(msg){
    let receiverName= chatTitle.innerHTML;
    if (msg.recipientId === receiverName){
        showMessage(msg)
    }
}

function receiveMessage(){
    socket.on('receiveMessage',(msg)=>{
        showMessage(msg)
        //showMessagePerUser(msg)
    } )
}


receiveMessage()

function showMessage(msg){
    let message= creatList(msg);
    chatsView.innerHTML+=message;
    //console.log(message)
}

async function sendMessage() {
    try{

        let chatName=chatTitle.innerHTML;
      console.log(userProfileContainer.childNodes[0].id)

        let dataPacket= {
            senderId: userProfileContainer.childNodes[0].id,
            recipientId: chatName,
            message: messageToBeSent.value
        }
        socket.emit("sendMessage",dataPacket);

        // send data to be saved at the server side
        let response= await sendData('http://localhost:3000/convo/addmessage', dataPacket)

        //showMessage(dataPacket);
        showMessagePerUser(dataPacket)

        //console.log(response)

    }catch(e){
        console.error(e)
    }
    
     
}

function clearMessageInput(){
    messageToBeSent.value='';
}


sendMessageButton.addEventListener('click', function handleSocketIntraction(){
    sendMessage();
    clearMessageInput();
})


export { ConnectWitChatServer, showMessage }










