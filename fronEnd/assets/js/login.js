import { showInformationToast, createSpinner, createToastImage } from './toaster.js'

let loginFormContainer= document.querySelector('#loginFormContainer');
let workingBody= document.querySelector('body');
let successImg= '/assets/svg/success-check.svg';
let failureImg='/assets/svg/failure-check.svg';
let spinner= createSpinner();


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
    workingBody.appendChild(spinner)

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
    try{
        let Formdata=getLoginFormData();
        let url="http://localhost:3000/api/login";

        showOpaqueLoginBackground();

        let results= await handleLocalRequest(url,Formdata);
        
        if (results.data.success===true){
            storeAccessToken(results.data.token);   
            setTimeout(function(){
                AlterLoginToast(results.data.message,successImg)
            },1000)
            setTimeout(function(){
                window.location.href= '../../main/userHome.html';
            },2000);
                    
        }else{
            AlterLoginToast(results.data.message,failureImg)
            setTimeout(function(){
                removeOpaqueLoginBackground()
            },2000)

        }
    }catch(e){
        AlterLoginToast("Session Expired", failureImg);
        setTimeout(function(){
            removeOpaqueLoginBackground()
        },1000);
        console.error(e);
    }
    
}

async function googleLogin(){
    await oauthSignIn()
}

var YOUR_CLIENT_ID = '982661396703-k16fr3na04n6but1eqkmfefq7doss0er.apps.googleusercontent.com';
var YOUR_REDIRECT_URI = 'http://localhost:8000/auth/login.html';
var fragmentString = location.hash.substring(1);

  // Parse query string to see if page request is coming from OAuth 2.0 server.

  let params = {};

function GsignIn(){
    let url=location.hash.replace('#','').split('&')
    console.log(url)
    for(let index=0; index < url.length; index++){
        let value= url[index].split('=');
        if(value[0]=='access_token'){
            console.log(value[1])
            localStorage.setItem('oauth2-test-params', value[1])
            return true
        }
    }
    return false
}


  

async function sendTokenServer(url,params){
    try{
        let Headers= { headers: {
            authorization: params
        }
        };
        console.log("help")
        let response= await handleLocalRequest(url,Headers)
        console.log(response)
    }catch(e){
        console.error(e)
    }
    

}

const url= 'http://localhost:3000/api/LoginWithGoogle'

  // If there's an access token, try an API request.
  // Otherwise, start OAuth 2.0 flow.
  function LoginWithGoogle() {
    if(!(GsignIn())) return console.log('Error');
    
    let severUrl=url
    let test_params=localStorage.getItem('oauth2-test-params')
    console.log(test_params)
    //params = JSON.parse(localStorage.getItem('oauth2-test-params'));
    if (test_params) {
      sendTokenServer(severUrl,test_params);
    } else {
      oauth2SignIn();
      
      sendTokenServer(severUrl,params);
    }
  }


/*
 * Create form to request access token from Google's OAuth 2.0 server.
 */
function oauth2SignIn() {
    // Google's OAuth 2.0 endpoint for requesting an access token
    var oauth2Endpoint = 'https://accounts.google.com/o/oauth2/v2/auth';
  
    // Create <form> element to submit parameters to OAuth 2.0 endpoint.
    var form = document.createElement('form');
    form.setAttribute('method', 'GET'); // Send as a GET request.
    form.setAttribute('action', oauth2Endpoint);
  
    // Parameters to pass to OAuth 2.0 endpoint.
    var params = {'client_id': YOUR_CLIENT_ID,
                  'redirect_uri': YOUR_REDIRECT_URI,
                  'response_type': 'token',
                  'scope': 'openid',
                  'include_granted_scopes': 'true',
                  'state': 'pass-through value'};
  
    // Add form parameters as hidden input values.
    for (var p in params) {
      var input = document.createElement('input');
      input.setAttribute('type', 'hidden');
      input.setAttribute('name', p);
      input.setAttribute('value', params[p]);
      form.appendChild(input);
    }
  
    // Add form to page and submit it to open the OAuth 2.0 endpoint.
    document.body.appendChild(form);
    form.submit();
  }



async function handleLocalRequest(url,data) {
    try{
        let request= await axios.post(url,data);
        return request;
    }catch(e){
        console.error(e)
    }
    
}

export {LoginUser, LoginWithGoogle}
