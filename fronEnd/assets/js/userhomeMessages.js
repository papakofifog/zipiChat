let chatsView = document.querySelector('.userContactsList');
let messageToBeSent= document.querySelector('#input')
let sendMessageButton= document.querySelector('#sendMessage')
let chatTitle= document.querySelector('#chat-name')
let userProfileContainer= document.querySelector('#userEverything')

//console.log()


function creatList(data){
    let messageList=`<li>${data}</li>`;
    return messageList;
}
let accessToken= window.sessionStorage.getItem('access-token');
const socket = io.connect(`http://localhost:3000`);


/*setTimeout(function sendUserId(){
    socket.emit('setUserId', );
},4000);*/


export default function ConnectWitChatServer(){
    socket.emit('setUserId', userProfileContainer.childNodes[0].id)

}

function receiveMessage(){
    socket.on('receiveMessage',(msg)=>{
        console.log(msg)
        let message= creatList(msg);
        chatsView.innerHTML+=message;
        console.log(message)
    } )
}

receiveMessage()

function sendMessage() {
    let chatName=chatTitle.innerHTML;
    socket.emit("sendMessage",{
        senderId: userProfileContainer.childNodes[0].id,
        recipientId: chatName,
        message: messageToBeSent.value
    });
}


sendMessageButton.addEventListener('click', function handleSocketIntraction(){
    
    sendMessage()
    
})










