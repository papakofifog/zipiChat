const loginStatusFeedbackElement=document.querySelector('#loginStatus');

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

function displayLoginSuccessStatus(){
    loginStatusFeedbackElement.innerHTML=message;
}

function displayLoginFailureStatus(message){
    loginStatusFeedbackElement.innerHTML=message;
}

async function LoginUser(){
    let Formdata=getLoginFormData();
    let url="http://localhost:3000/api/login";
    let data= await handleLocalRequest(url,Formdata);
    console.log(JSON.stringify(data))
    if (data.success===true){
        console.log(data.success)
        storeAccessToken(data.token);
        const myHeaders= new Headers();
        let user= window.sessionStorage.getItem('access-token');
        myHeaders.set('access-token', user['access-token'] )
        setTimeout(function(){
            displayLoginSuccessStatus(data.message);
            window.location.href= '../../main/userHome.html';
        },5000)
    }else{
        setTimeout(function(){
            displayLoginFailureStatus(data.message);
        },5000)

    }
}

async function handleLocalRequest(url,data) {
    let request= await axios.post(url,data);
    return request.data;
}

export {LoginUser}
