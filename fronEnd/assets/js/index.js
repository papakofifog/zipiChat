function handleRequest(url,data) {
    axios.post(url, {
        email:data.email,
        password:data.password
    }).then(function (response) {
        console.log("hello",response)
    }) .catch(function (error) {
        // handle error
        console.log(error);
      })
}

function getLoginFormData(){
    let inputUsername= document.querySelectorAll('#uname');
    let inputPassword= document.querySelectorAll('#pass');
    let data = {
        username: inputUsername,
        password: inputPassword
    }
    return data;
}

document.querySelector('#login').addEventListener('click', async ()=>{
    let Formdata=getLoginFormData();
    url="http://localhost:3000/api/login"
    await handleRequest(url,Formdata);
})
