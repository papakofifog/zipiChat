import { showInformationToast, createSpinner, createToastImage } from './toaster.js'

let loginFormContainer= document.querySelector('#loginFormContainer');
let workingBody= document.querySelector('body');
let successImg= '/assets/svg/success-check.svg';
let failureImg='/assets/svg/failure-check.svg';


function storeAccessToken(data){
    return window.sessionStorage.setItem('access-token',data);
}

function getLoginFormData(){
    let userEmail= document.querySelector('#email');
    let userPassword= document.querySelector('#pass');
    let data = {
        email: userEmail.value,
        password: userPassword.value
    }
    
    return data;
}

function showOpaqueLoginBackground(){
    loginFormContainer.style.display='none';
    workingBody.classList.add('opaqueBody');
    workingBody.appendChild(showInformationToast('Authenticating User'));

}

function showLoginSpinner(){
    let loginSpinner=createSpinner();
    let toast= document.querySelector('#tC');
    workingBody.removeChild(toast);
    workingBody.appendChild(loginSpinner);
}

function removeOpaqueLoginBackground(){
    window.location.reload();
}

function AlterLoginToast(message,badge){
    let toastItem= document.querySelector('#tT');
    toastItem.innerHTML=message;
    let statusImage=createToastImage(badge,'successImage');
    document.querySelector('#tC').appendChild(statusImage);
}



async function LoginUser(){
    let Formdata=getLoginFormData();
    let url="http://localhost:3000/api/login";

    showOpaqueLoginBackground();

    let results= await handleLocalRequest(url,Formdata);
    
    if (results.data.success===true){
        storeAccessToken(results.token);   
        setTimeout(function(){
            AlterLoginToast(results.data.message,successImg)
        },1000)
        setTimeout(function(){
            window.location.href= '../../main/userHome.html';
        },2000)
                
    }else{
        AlterLoginToast(results.data.message,failureImg)
        setTimeout(function(){
            removeOpaqueLoginBackground()
        },2000)

    }
}

async function handleLocalRequest(url,data) {
    let request= await axios.post(url,data);
    return request;
}

export {LoginUser}
