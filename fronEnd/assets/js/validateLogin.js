let emailInput=document.querySelector('#email');
let passwordInput= document.querySelector('#pass');
let logIn= document.querySelector('#login');

function validateEmail(input){
    emailRegex= /^\w+@\w+\.com$/
    emailInputStatus= emailRegex.test(input.value);
    if(emailInputStatus){
        hideErrorMessage(input);
        alertSuccess(input);
        return true
    }else{
        showErrorMessage(input);
        alertProblem(input);
        return false;
    }
}

function validatePassword(input){
    if (input.value!=''){
        hideErrorMessage(input);
        alertSuccess(input);
        return true;
    }else{
        showErrorMessage(input)
        alertProblem(input)
        return false;
    }
}

function showErrorMessage(input){
    return document.querySelector('#error-l'+input.id).style.display='block';
}

function hideErrorMessage(input){
    return document.querySelector('#error-l'+input.id).style.display='none';
}

function alertSuccess(input){
    return input.style.borderColor="green";
}
function alertProblem(input){
    return input.style.borderColor='red';
}

function validateBoth(){
    document.querySelectorAll('input').forEach((x)=>{
        x.addEventListener('keyup', ()=>{
            switch(x.type){
                case 'email':
                    validateEmail(x);
                    break;
                
                case 'password':
                    validatePassword(x);
                    break;
                default:
                    break;
            }
        })
    })
    
}

validateBoth();




function validateLogin(){
    logIn.addEventListener('click', ()=>{
        if(validateEmail(emailInput) && validatePassword(passwordInput)){
            // we good to send the request
            console.log('we good')
        }
        else{
            // we are not good to send the request
            console.log('we aint good')
        }

    })
}

validateLogin();