//import { showMessage } from "./userhomeMessages.js";
import { sendData } from "./handleRequest.js";
import { showMessage } from "./userhomeMessages.js";
const userContactsContainer= document.querySelector('#userContactsList');
const chatWithFriendIcon= document.querySelector('#chatFriendIcon');
const chatWithUserUsername= document.querySelector('#chat-name');
const chatsView = document.querySelector('#messages');
let currentUser= document.querySelector('#userEverything')



function MonitorClickFriend(){
    //console.log("monitoring click event")
    let userContacts= userContactsContainer.childNodes;
    //console.log(userContacts)
    userContacts.forEach((x)=>{
        x.addEventListener('click', async function chatWithUser(){
            chatsView.innerHTML='';
            chatWithFriendIcon.src=x.childNodes[1].childNodes[1].src;
            chatWithUserUsername.innerText=x.id;

            let chatsBetweenUsers= await getInterPersonalChats(currentUser.childNodes[0].id,x.id)
            console.log(currentUser.childNodes[0].id,x.id)
            //console.log(chatsBetweenUsers)
            walkthroughMessages(chatsBetweenUsers)

        })
    })
    
    
}


async function getInterPersonalChats(senderID, receiverID){
    try{
        let url='http://localhost:3000/convo/readAllConvo';
        let data= {'sender':senderID, 'receiver': receiverID}
        let userChats= await sendData(url,data);
        return userChats.data.data;
    }catch(e){
        console.error(e)
    }
    
}

function walkthroughMessages(data){
    try {
        data.forEach((msg)=>{
            showMessage(msg)
        })
    }catch(e){
        console.error(e)
    }
}

export {MonitorClickFriend}

