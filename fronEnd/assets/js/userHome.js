import { showInformationToast, createSpinner, createToastImage  } from "./toaster.js"
import { MonitorClickFriend } from "./handleChat.js";
import { ConnectWitChatServer } from './userhomeMessages.js'


let userHomeBoard= document.querySelector('#userHome');
let workingBody= document.querySelector('body');
let userContacts=document.querySelector('#userContactsList');
let userProfileBoard= document.querySelector('#userEverything');
let Spinner=createSpinner();


function createContact(data){
    let contactPicture='http://localhost:3000'+data.picUrl;
    if(!data.picUrl) contactPicture= 'http://localhost:8000/assets/svg/user.svg'
    let newContact=`<li id=${data.username}  type="button">
    <div class="userImg contactImg">
    <img class="contactImg" src="${contactPicture}" alt="img"></div>
    <div class="userFriendName">${data.fullname}</div>
    <div>
        <img class='icon' src="/assets/svg/chat.svg" alt="chat icon" >
    </div>
    </li>`;

    return newContact;
}



function showUserContacts(data){
    let userFriends=generateUserContacts(data)
    userContacts.appendChild(userFriends);
}

function showUserProfile(data){
    let userPicture=`http://localhost:3000${data.userPic}.jpg`;
    if(!data.userPic)userPicture='http://localhost:8000/assets/svg/user.svg';
    let userProfile=`<div id=${data.username} class="userImg">
    <img class='userImg' src="${userPicture}" alt="User image">
  </div>
  <div style="display: block;">
    <div>
      <p id="userFullName">${data.firstname+' '+data.lastname}</p>
    </div>
    <div>
      <div id='userFriends'>Friends: ${data.friendCount}</div>
      <div style="display: flex; gap: 10px; flex-wrap: wrap ;">
        <i><img class='icon' src='/assets/svg/facebook.svg' alt="facebook"></i>
        <i><img class='icon' src='/assets/svg/twitter.svg' alt="twiter"></i>
        <i><img class='icon' src='/assets/svg/instagram.svg' alt="instagram"></i>
        <i><img class='icon' src='/assets/svg/snapchat.svg' alt="snapchat"></i>
      </div>
    </div>

  </div>`;
  //console.log(userProfile)
  return userProfile;
}

function showOpaqueHomeBackground(){
    userHomeBoard.style.display='none';
    workingBody.classList.add('opaqueBody');
    workingBody.appendChild(Spinner);
}

function removeOpaqueHomeBackground(){
    userHomeBoard.style.display='block';
    workingBody.classList.remove('opaqueBody');
    workingBody.removeChild(Spinner);
}

async function postUserRequest(url,Headers){
    try{
        let data=await axios.get(url,Headers);
        return data;
    }catch(e){
        console.error(e)
    }
    
}

async function getUserData(){
    let url='http://localhost:3000/users/activeuser'
    let user= window.sessionStorage.getItem('access-token');
    let Headers={ headers: {
        authorization: user
      }
    }
    let results= await postUserRequest(url,Headers).catch((e)=>{
        console.error(e)
    });
    return results

}
async function formatActiveUserData(){
    try{
        let results= await getUserData();
        let userData= {
        firstname: results.data.data.firstname,
        lastname: results.data.data.lastname,
        username: results.data.data.username,
        email: results.data.data.email,
        Dob: results.data.data.Dob,
        friendCount: results.data.data.friendCount,
        userPic: results.data.data.pictures
        }
        //console.log(userData.userPic)
        return userData;
    }catch(e){
        console.error(e)
    }
    
}

async function getUserFriends(){
    let url='http://localhost:3000/users/friends';
    let user= window.sessionStorage.getItem('access-token');
    let Headers={ headers: {
        authorization: user
      }
    }
    let results= await postUserRequest(url,Headers).catch((e)=>{
        console.error(e)
    });
    return results
}

async function formatActiveUserFriends(){
    try{
        let activeUserFriends= await getUserFriends();
        console.log(activeUserFriends.data.data)
        let friendListHtmlCode=generateUserContacts(activeUserFriends.data.data);
        return friendListHtmlCode;
    }catch(e){
        console.error(e)
    }
}

function generateUserContacts(data){
    let friendList='';
    let noFriends= data.length;
    for(let i=0; i< noFriends; i++){
        friendList+=createContact(data[i]);
    }
    //console.log(friendList)
    return friendList;
}

window.addEventListener('load',async function(){
    showOpaqueHomeBackground();
    
    let results= await formatActiveUserData();
    let friends= await formatActiveUserFriends();

    
    let userProfileData= showUserProfile(results);
    userProfileBoard.innerHTML=userProfileData;
    let userFriends=friends;
    
    userContacts.innerHTML=userFriends;
    ConnectWitChatServer();
    MonitorClickFriend();

    this.setTimeout(function(){
        removeOpaqueHomeBackground();
    },1000)
});