import { sendData } from "./handleRequest.js";
import { showInformationToast } from "./toaster.js";

let chatsView = document.querySelector('#messages');
let messageToBeSent= document.querySelector('#input')
let sendMessageButton= document.querySelector('#sendMessage')

let userProfileContainer= document.querySelector('#userEverything');

let attatchFileBtn= document.querySelector('#attatchFile');
let UserHome= document.querySelector('#userHome');






function creatList(data){
    console.log(data.sender_id);
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




function ConnectWitChatServer(){
    socket.emit('setUserId', userProfileContainer.childNodes[0].id)

}

function showMessagePerUser(msg){
    let chatTitle= document.querySelector('#chat-name');
    let receiverName= chatTitle.innerHTML;
    console.log(msg.recipientId , receiverName)
    if (msg.recipientId === receiverName){
        showMessage(msg)
    }
}

function receiveMessage(){
    socket.on('receiveMessage',(msg)=>{
        showMessage(msg)
        
        //showMessagePerUser(msg)
        //console.log(2)
    } )
}


receiveMessage()

function showMessage(msg){
    let message= creatList(msg);
    chatsView.innerHTML+=message;
    //console.log(message)
}

async function sendMessage() {
    let chatTitle= document.querySelector('#chat-name');
    try{
        console.log(chatTitle);
        let chatName=chatTitle.innerHTML;
        console.log(userProfileContainer.childNodes[0].id)

        let dataPacket= {
            senderId: userProfileContainer.childNodes[0].id,
            recipientId: chatName,
            message: messageToBeSent.value,
            sentAt: Date()
        }

        socket.emit("sendMessage",dataPacket);

        // send data to be saved at the server side
        await sendData('http://localhost:3000/convo/addmessage', dataPacket)

    
        showMessagePerUser(dataPacket)

        console.log(1)

    }catch(e){
        console.error(e)
    }
    
     
}

function clearMessageInput(){
    messageToBeSent.value='';
}


function showUploadToast(){
    let uploadContainer=`<div class='upload-container'>
    <div class="filePreview">
      upload a file
    </div>
    <input class="form-control" type="file" name="" id="">
    <div class="row ">
      <div class="col-xl-6">
        <button id='addfile' class="btn btn-block btn-primary">Upload</button>
      </div>
      <div class="col-xl-6">
        <button id='cancel-upload'  class="btn btn-block btn-danger">Cancel</button>
      </div>
    </div>
  </div>`
    let toast= showInformationToast(uploadContainer);
    return toast;
    
}

function modifyMainForUpload(){
    let uploadToast=showUploadToast();
    let mask=`<div id='backdrop' class="backdropMask">${uploadToast}</div>`
    let mainBodyState=UserHome.innerHTML;
    UserHome.innerHTML+=mask;
    let cancelButton=document.querySelector('#cancel-upload');
    cancelButton.addEventListener('click',()=>{
        cancelUpload(mainBodyState);
        //console.log(document);
    })
    
}



function cancelUpload(data){
    UserHome.innerHTML=data;
}




sendMessageButton.addEventListener('click', function handleSocketIntraction(){
    sendMessage();
    clearMessageInput();
})

attatchFileBtn.addEventListener('click', function handleUploadInteraction(){
    modifyMainForUpload();

} )





export { ConnectWitChatServer, showMessage }










