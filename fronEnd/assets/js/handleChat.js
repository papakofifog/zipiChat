const userContactsContainer= document.querySelector('#userContactsList');
const chatWithFriendIcon= document.querySelector('#chatFriendIcon');
const chatWithUserUsername= document.querySelector('#chat-name');


export default function MonitorClickFriend(){
    //console.log("monitoring click event")
    let userContacts= userContactsContainer.childNodes;
    //console.log(userContacts)
    userContacts.forEach((x)=>{
        x.addEventListener('click', function chatWithUser(){
            
            chatWithFriendIcon.src=x.childNodes[1].childNodes[1].src;
            chatWithUserUsername.innerText=x.id;

        })
    })
    
    
}

