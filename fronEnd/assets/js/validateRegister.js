const firstName=document.querySelector('#fname');
const lastName= document.querySelector('#lname');
const username= document.querySelector('#uname');
const Dob= document.querySelector('#dob');
const email= document.querySelector('#email');
const password= document.querySelector('#pass');
const confirmPassword= document.querySelector('#com-pass');

const registerButton= document.querySelector('#register');

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
    emailRegex= /^\w+@\w+.com$/
    emailInputStatus= emailRegex.test(x.value);
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

function validatePassword(x){
    passwordRegex= /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*_=+-]).{8,16}/;
    paswordStatus= passwordRegex.test(x.value);
    if(paswordStatus){
        alertSuccess(x);
        hideErrorMessage(x);
        return true;
    }else{
        alertProblem(x)
        showErrorMessage(x);
        return false;
    }
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
                        validatePassword(x)
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



function registerUser(){
    registerButton.addEventListener('click', function validateAllInputs(){
       if(isNameInputsEmpty() && validateEmail(email) && validatePassword(password) && comparePasswords(confirmPassword)){
        // send the request to create the account
        console.log("We are good")
       }else{
        // 
        console.log('We are not good')
       }
    })
}

registerUser();