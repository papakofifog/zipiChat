let chatsView = document.querySelector('.userContactsList');
let messageToBeSent= document.querySelector('#input')
let sendMessageButton= document.querySelector('#sendMessage')

function creatList(data){
    let messageList=`<li>${data}</li>`;
    return messageList;
}



sendMessageButton.addEventListener('click', function sendServerMessage(){
    const socket = io.connect('http://localhost:3000');

    function sendMessage() {

        socket.emit('message', messageToBeSent.value  );
    }
    sendMessage();
})







