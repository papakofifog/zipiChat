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



function showLoginToast(message,color){
    Toastify({
        text: message,
        duration: 4000,
        //destination: "../../auth/login.html",
        newWindow: true,
        offset: {
            x: 50, // horizontal axis - can be a number or a string indicating unity. eg: '2em'
            y: 10 // vertical axis - can be a number or a string indicating unity. eg: '2em'
          },
        close: true,
        gravity: "top", // `top` or `bottom`
        position: "left", // `left`, `center` or `right`
        //stopOnFocus: true, // Prevents dismissing of toast on hover
        style: {
          background: "linear-gradient(to right, #00b09b, #96c93d)",
          color:color
        },
        //onClick: function(){} // Callback after click
      }).showToast();
      
}


async function LoginUser(){
    let Formdata=getLoginFormData();
    let url="http://localhost:3000/api/login";
    let results= await handleLocalRequest(url,Formdata);
    //console.log(results.data.message)
    if (results.data.success===true){
        storeAccessToken(results.token);
        const myHeaders= new Headers();
        let user= window.sessionStorage.getItem('access-token');
        myHeaders.set('access-token', user['access-token'] )
        showLoginToast(results.data.message,'rgb(0, 128, 0)');
        setTimeout(function(){
            window.location.href= '../../main/userHome.html';
        },4000)
                
    }else{
        setTimeout(function(){
            showLoginToast(results.data.message,'rgb(128,0,0)');
        },5000)

    }
}

async function handleLocalRequest(url,data) {
    let request= await axios.post(url,data);
    return request;
}

export {LoginUser}
