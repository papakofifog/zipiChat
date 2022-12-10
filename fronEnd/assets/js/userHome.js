import { showInformationToast, createSpinner, createToastImage  } from "./toaster.js"

let userHomeBoard= document.querySelector('#userHome');
let userContacts=document.querySelector('#userConatactList');
let userProfileBoard= document.querySelector('#userEverything');

function createContact(data){
    let newContact=`<li type="button">
    <div class="userImg contactImg">
    <img src="${data.picUrl}" alt="contactUrl">
    </div><div id="userFriendName">${data.fristname} ${data.lastname}
    </div><div><img class='icon' src="../svg/success-check.svg" alt="chat icon" >
    </div>
    </li>`;
    return newContact;
}

function generateUserContacts(data){
    let friendList='';
    for(let i=0; i< data.length; i++){
        friendList+=createContact(data);
    }
    return friendList;
}

function showUserContacts(data){
    let userFriends=generateUserContacts(data)
    userContacts.appendChild(userFriends);
}

function showUserProfile(data){
    let userProfile=`<div class="userImg">
    <img src="${data.userPic}" alt="User image">
  </div>
  <div style="display: block;">
    <div>
      <p id="userFullName">${data.fristname} ${data.lastname}</p>
    </div>
    <div>
      <div id='userFriends'>Friends:${data.friendCount}</div>
      <div style="display: flex; gap: 10px; flex-wrap: wrap ;">
        <i><img class='icon' src="../svg" alt="facebook"></i>
        <i><img class='icon' src="../svg" alt="twiter"></i>
        <i><img class='icon' src="../svg" alt="instagram"></i>
        <i><img class='icon' src="../svg" alt="snapchat"></i>
      </div>
    </div>

  </div>`;
  return userProfile;
}

function showOpaqueHomeBackground(){
    userHomeBoard.style.display='none';
    workingBody.classList.add('opaqueBody');
    createSpinner();

}

function removeOpaqueHomeBackground(){
    window.location.reload();
}

async function postUserRequest(url,Headers){
    try{
        let data=await axious.post(url,Headers);
        return data;
    }catch(e){
        console.error(e)
    }
    
}

async function getUserData(){
    url='http://localhost:3000/users/activeuser'
    const myHeaders= new Headers();
    let user= window.sessionStorage.getItem('access-token');
    myHeaders.set('access-token', user['access-token'] )
    let results= await postUserRequest(url,myHeaders);
    return results

}


document.addEventListener('load',async function(){
    showOpaqueHomeBackground();
    let results= {
        firstname:"Papa Kofi",
        lastname:"Asante",
        friendCount: 10,
        userPic:'../pictures/pexels-daniel-absi-952670.jpg'
    }
    let friends=[
    {
        firstname:'Kwesi',
        lastname:'Sekyr3',
        picUrl:'../pictures/pexels-miguel-á-padriñán-1111368.jpg'
    },
    {
        firstname:'Kweku',
        lastname:'Asante',
        picUrl:'../pictures/pexels-mudassir-ali-2680270.jpg'
    },
    {
        firstname:'Emmanuel',
        lastname:'Forson',
        picUrl:'../pictures/pexels-ovan-62693.jpg'
    }
    ]
    let userProfileData= showUserProfile(results);
    userProfileBoard.innerHTML=userProfileData;
    let userFriends=generateUserContacts(friends);
    userContacts.innerHTML=userFriends;
});