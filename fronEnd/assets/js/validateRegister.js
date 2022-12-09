const firstName=document.querySelector('#fname');
const lastName= document.querySelector('#lname');
const username= document.querySelector('#uname');
const Dob= document.querySelector('#dob');
const email= document.querySelector('#email');
const password= document.querySelector('#pass');
const confirmPassword= document.querySelector('#com-pass');

const registerButton= document.querySelector('#register');



import { registerUser } from "./register.js";


function comparePasswords(x){
    if(password.value === x.value){
        alertSuccess(x);
        hideErrorMessage(x);
        return true;
    }else{
        showErrorMessage(x);
        alertProblem(x);
        return false;
    }
}

function validateEmail(x){
    let emailRegex=/^\w+@\w+\.com$/;
    let emailInputStatus= emailRegex.test(x.value);
    if(emailInputStatus){
        alertSuccess(x);
        hideErrorMessage(x);
        return true;
        
    }else{
        alertProblem(x);
        showErrorMessage(x)
        return false;
    }
    
}

function validateNames(input){
    if(input.value !=''){
        alertSuccess(input);
        hideErrorMessage(input);
        return true;
    }else{
        alertProblem(input);
        showErrorMessage(input)
        return false;
    }
}

function isPasswordContainSmallLetterValid(x){
    let smalletterRegex= /(?=.*[a-z])/;
    if(smalletterRegex.test(x.value)){
        return isPasswordCapitalLetterValid(x)
    }else{
        let message= "Pasword should have atleat one lowercase letter";
        showPasswordErrorMessage(x,message);
        alertProblem(x)
        return false;
    }
        
    
}

function isPasswordCapitalLetterValid(x){
    let capitalLeterRegex= /(?=.*[A-Z])/;
    if(capitalLeterRegex.test(x.value)){
        return isPasswordNumericallyValid(x)
    }else{
        let message= "Password should have atleast one uppercase letter";
        showPasswordErrorMessage(x, message);
        alertProblem(x)
        return false;
    }
}

function isPasswordNumericallyValid(x){
    let numericalLetterRegex= /(?=.*[0-9])/;
    if(numericalLetterRegex.test(x.value)){
        return isPasswordSybolValid(x);
    }else{
        let message= "Password should have atleast one number";
        alertProblem(x)
        return false;
    }
}

function isPasswordSybolValid(x){
    let symbolRegex= /(?=.*[!@#$%^&*_=+-])/;
    if(symbolRegex.test(x.value)){
        return isPasswordSizeValid(x);
    }else{
        let message="Password should have atleast one symbol";
        showPasswordErrorMessage(x, message);
        alertProblem(x)
        return false;
    }
}

function isPasswordSizeValid(x){
    let passwordSizeRegex= /.{8,16}/;
    
    if(passwordSizeRegex.test(x.value)){
        return validatePassword(x);
    }else{
        let message= "Password should be 8-16 chars long";
        showPasswordErrorMessage(x,message);
        alertProblem(x)
        return false;
    }
   
    
}

function validatePassword(x){
    alertSuccess(x);
    hideErrorMessage(x);
    return true;
    
}

function validateInteractively(){
    document.querySelectorAll('input').forEach((x)=>{
        switch(x.type){

            case "text":
                x.addEventListener('keyup', ()=>{
                    validateNames(x);
                })
                break; 
            
            case "date":
                x.addEventListener('change', ()=>{
                    validateNames(x);
                })
                break; 

            case 'email':
                x.addEventListener('keyup', ()=>{
                    validateEmail(x);
                }) 
                break;

            case 'password':
                
                x.addEventListener('keyup',()=>{
                    if (x.id=== 'pass'){
                        isPasswordContainSmallLetterValid(x)
                    }else{
                        comparePasswords(x)
                    }
                })
                break;
                

        default:
            break;
        }
    })
}

validateInteractively();

function showErrorMessage(inputId){
    return document.querySelector('#error-'+inputId.id).style.display='block';
}

function showPasswordErrorMessage(inputId,message){
    document.querySelector('#error-'+inputId.id).innerHTML=message;
    return document.querySelector('#error-'+inputId.id).style.display='block';
}


function hideErrorMessage(inputId){
    return document.querySelector('#error-'+inputId.id).style.display='none';
}

function alertSuccess(input){
    return input.style.borderColor="green";
}
function alertProblem(input){
    return input.style.borderColor='red';
}



function isNameInputsEmpty(){
    if(validateNames(firstName)&&validateNames(lastName)&&validateNames(Dob)&&validateNames(username)){
        return true;
    }
    return false;
}

function showErrorServerErrorMessage(message){
    return document.querySelector('server-message').innerHTML=message
}

function showRegisterToast(message,color){
    setTimeout(function(){
        window.location.href="../../auth/login.html";
      },5000)
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
        stopOnFocus: true, // Prevents dismissing of toast on hover
        style: {
          background: "linear-gradient(to right, #00b09b, #96c93d)",
          color:color
        },
        onClick: function(){} // Callback after click
      }).showToast();
      
      
}

function validateRegistrationInputs(){
    registerButton.addEventListener('click', async function validateAllInputs(){
       if(isNameInputsEmpty() && validateEmail(email) && validatePassword(password) && comparePasswords(confirmPassword)){
        // send the request to create the 
        let results= await registerUser();
        console.log(results)
        let registerStatus=document.querySelector('.server-message');
        //console.log(registerStatus)
        if(results.data.status === true){
            //console.log(results.data)
            showRegisterToast(results.data.message,'green');
        }else{
            // request failed
            console.log("hey bby")
            showRegisterToast(results.data.message, 'red');

            //return;
        }
        
       }
    })
}

validateRegistrationInputs();

