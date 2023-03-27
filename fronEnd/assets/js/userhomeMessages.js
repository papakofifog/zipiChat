import { sendData, getData, sendFormData } from "./handleRequest.js";
import { showInformationToast } from "./toaster.js";
//import { dropDown  } from "./componets.js"

let chatsView = document.querySelector('#messages');
let messageToBeSent= document.querySelector('#input')
let sendMessageButton= document.querySelector('#sendMessage')

let userProfileContainer= document.querySelector('#userEverything');

let attatchFileBtn= document.querySelector('#attatchFile');
let backDropMask= document.querySelector('#backdrop');
let addEmogiButton= document.querySelector('#addEmoji');
let dropdownWrapper= document.querySelector('#dropdownWrapper');




function creatList(data){
    console.log(data.sender_id);
    console.log(data.sender_id === userProfileContainer.childNodes[0].id)
    let listClass='receiver';
    if (data.senderId=== userProfileContainer.childNodes[0].id ){
        listClass='sender';
    }
    //const pattern = /^(https?:\/\/)?([\w.-]+)\.([a-z]{2,})(:\d{1,5})?([/?#].*)?$/i;

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
    let uploadContainer=`<div class='container-fluid upload-container'>
    <div class="filePreview">
      <i class="fas fa-file-upload"></i>
    </div>
    <input class="form-control" type="file" name="" id="inputFile">
    <div class="row">
      <div class="col-sm-6">
        <button id='addfile' class="btn btn-primary">Upload</button>
      </div>
      <div class="col-sm-6">
        <button id='cancel-upload'  class="btn btn-danger">Cancel</button>
      </div>
    </div>
  </div>`
    let toast= showInformationToast(uploadContainer);
    return toast;
    
}

function PreviewPicture(value){
    let documentPreview= document.querySelector('.filePreview');
    documentPreview.innerHTML=`<img class='img-thumbnail' src='${URL.createObjectURL(value)}' alt='inputfile' >`;

}

async function uploadFunctionCloudinary(value){
    // create a form data object
    let formData= new FormData();
    formData.append('file', value);

    //send the file using axios
    
    let uploadedFileData= await sendFormData("http://localhost:3000/users/upload", formData);

    //console.log(uploadedFileData.data)
    let CloudinaryFileData=uploadedFileData.data;

    /*document.querySelector('.messageList ').addEventListener('click', function(event){
        window.open(event.target.src, '_blank');
    })*/
    
    if(CloudinaryFileData.success){
        messageToBeSent.value+=`<img src='${CloudinaryFileData.data.url}' alt='sentFile'></img>`;
        backDropMask.classList.remove('block'); 

        
    } 
    
    

}

function modifyMainForUpload(){
    let uploadToast=showUploadToast();
    uploadToast.classList.add('centerItem');
    backDropMask.innerHTML=uploadToast.outerHTML;
    backDropMask.classList.add('block');
    let cancelButton=document.querySelector('#cancel-upload');
    let uploadButton= document.querySelector("#inputFile");
    let storeUpload = document.querySelector('#addfile');
    uploadButton.addEventListener('change', (element)=>{
        PreviewPicture(element.target.files[0]);
    })
    storeUpload.addEventListener('click', function(){
        let targetFile = uploadButton.files[0];
        uploadFunctionCloudinary(targetFile);

    })
    cancelButton.addEventListener('click',()=>{
        backDropMask.classList.remove('block'); 
    })
    
}



sendMessageButton.addEventListener('click', function handleSocketIntraction(){
    sendMessage();
    clearMessageInput();
})

attatchFileBtn.addEventListener('click', function handleUploadInteraction(){
    modifyMainForUpload();

} )





function addEmogi(){
    let selectedEmoji="";
    addEmogiButton.addEventListener('click', ()=>{
        const pickerOptions = { onEmojiSelect: function(event){
            messageToBeSent.value+=event.native;
            dropdownWrapper.removeChild(document.querySelector('#emojiPicker'));
        } }
        const picker = new EmojiMart.Picker(pickerOptions)
        picker.id="emojiPicker";
        console.log(picker)
        document.querySelector('em-emoji-picker')?dropdownWrapper.removeChild(document.querySelector('#emojiPicker')): dropdownWrapper.appendChild(picker)
    })
    
}

addEmogi()


export { ConnectWitChatServer, showMessage }










