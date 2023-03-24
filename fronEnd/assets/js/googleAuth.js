import {getData} from './handleRequest.js'
let loginGoogle= document.querySelector('#signin-button')


loginGoogle.addEventListener('click', async function(){
    await getData("http://localhost:3000/auth/google");
})


    
