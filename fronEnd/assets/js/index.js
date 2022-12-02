function storeAccessToken(data){
    
    const user= {
        userId: data['data']['_id'],
        username: data['data']['username'],
        'access-token': data.token
    }
    window.sessionStorage.setItem('user',JSON.stringify(user));
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



function getRegisterFormData(){
    let firstname= document.querySelectorAll('#fname');
    let lastname= document.querySelectorAll('#lname');
    let username= document.querySelectorAll('#uname');
    let email= document.querySelectorAll('#email');
    let password= document.querySelectorAll('#pass');
    let Dob= document.querySelectorAll('#dob');
    let data= {
        firstname: firstname.value,
        lastname: lastname.value,
        username: username.value,
        email:email.value,
        password:password.value,
        Dob:Dob.value
    }
    return data;
}

document.querySelector('#login').addEventListener('click', async ()=>{
    console.log('bitch')
    let Formdata=getLoginFormData();
    //console.log(Formdata);
    url="http://localhost:3000/api/login";
    let data= await handleLocalRequest(url,Formdata);
    console.log(JSON.stringify(data))
    if (data.success===true){
        storeAccessToken(data);
        const myHeaders= new Headers();
        let user= window.sessionStorage.getItem('user');
        myHeaders.set('access-token', user['access-token'] )
        window.location.href= '../../main/userHome.html'
    }else{
        return alert("Imvalid Credentials")
    }
})

document.querySelector('#register').addEventListener('click', async ()=>{
    let Formdata= getRegisterFormData();
    url= "http://localhost:3000/api/signUp";
    await handleLocalRequest(url,Formdata)
})

async function handleLocalRequest(url,data) {
    let request= await axios.post(url,data);
    return request.data;
}

document.querySelector('#googleLogin').addEventListener('click', async ()=>{
    
    url='http://localhost:3000/api/google';
    await handleGoogleApiRequest(url);
})


function handleGoogleApiRequest(url){
    axios.post(url,data).then((response)=>{
        console.log(reponse.data);
    }).catch((e)=>{
        console.error(e)
    })
}
