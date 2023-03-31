import {  createSpinner } from "./toaster.js"
import { MonitorClickFriend, MonitorOptions } from "./handleChat.js";
import { ConnectWitChatServer } from './userhomeMessages.js';
import { getData } from './handleRequest.js'


let userHomeBoard= document.querySelector('#userHome');
let workingBody= document.querySelector('body');
let userContacts=document.querySelector('#userContactsList');
let userProfileBoard= document.querySelector('#userEverything');
let Spinner=createSpinner();
let friendItem1= document.querySelector('#friendItem-1');
let friendItem2= document.querySelector('#friendItem-2');


function createContact(data){
    
    let contactPicture=data.picUrl? `<img class="contactImg" src="http://localhost:3000'+${data.picUrl}" alt="img">`:`<div class="contactImg contactNoPic">${data.firstname[0]+data.lastname[0]}</div>`;
    
    return `<li id=${data.username}  type="button">
    <div class="userImg contactImg">
        ${contactPicture}
    </div>
    <div class="userFriendName">${data.firstname+' '+data.lastname}</div>
    <div>
       <i class="fas fa-comment-alt"></i>
    </div>
    </li>`;

}



function showUserContacts(data){
    let userFriends=generateUserContacts(data)
    userContacts.appendChild(userFriends);
}

function showUserProfile(data){
    let userPicture=`<img class='userImg' src="http://localhost:3000${data.userPic}.jpg" alt="User image">`;
    if(!data.userPic)userPicture=`<div class='contactImg contactactNoPic'>${data.firstname[0]+data.lastname[1]}</div>`;
    let userProfile=`<div id=${data.username} class="userImg">
    ${userPicture}
  </div>
  <div style="display: block;">
    <div>
      <p id="userFullName">${data.firstname+' '+data.lastname}</p>
    </div>
    <div>
      <div id='userFriends'>Friends: ${data.friendCount}</div>
      <div style="display: flex; gap: 10px; flex-wrap: wrap ;">
        <i class="fab fa-facebook"></i>
        <i class="fab fa-twitter"></i>
        <i class="fab fa-instagram"></i>
        <i class="fab fa-snapchat"></i>
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


async function getUserData(){
    let url='http://localhost:3000/users/activeuser'
    let results= await getData(url).catch((e)=>{
        console.error(e)
    });
    console.log(results);
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
        return userData;
    }catch(e){
        console.error(e)
    }
    
}

async function getUserFriends(){
    let url='http://localhost:3000/friend/getUsersFriends';
    let results= await getData(url).catch((e)=>{
        console.error(e)
    });
    return results;
}

async function getAllUsers(){
    let url = 'http://localhost:3000/friend/getUsersFriends';
    let results= await getData(url).catch((e)=>{
        console.error(e)
    });
    return results;
}

async function formatActiveUserFriends(){
    try{
        let activeUserFriends= await getUserFriends();
        let friendListHtmlCode=generateUserContacts(activeUserFriends.data.data);
        return friendListHtmlCode;
    }catch(e){
        console.error(e)
    }
}
async function formatAllUsers(){
    try{
        let allUsers= await getAllUsers();
        let UserListHTMLCode= generateUserContacts(allUsers.data.data);
        return UserListHTMLCode;
    }catch(e){
        console.error(e)
    }
}

function generateUserContacts(data){
    let friendList='';
    console.log(data)
    data.map((friend)=>{
        friendList+=createContact(friend)
    })
    return friendList;
}

window.addEventListener('load',async function(){
    showOpaqueHomeBackground();
    
    let results= await formatActiveUserData();
    let friends= await formatActiveUserFriends();

    
    let userProfileData= showUserProfile(results);
    userProfileBoard.innerHTML=userProfileData;
    friendItem1.innerHTML="Contacts";
    friendItem2.innerHTML="NewContacts";
    let userFriends=friends;
    

    userContacts.innerHTML=userFriends;
    ConnectWitChatServer();
    MonitorClickFriend();
    MonitorOptions();

    this.setTimeout(function(){
        removeOpaqueHomeBackground();
    },1000)
});

export {formatActiveUserFriends, formatAllUsers}