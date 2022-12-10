function successMessage(message,data='No data requested',token='verified'){
    let result= new Object({
        "success": true,
        "message": message,
        data,
        "token":token
    })
        
    return result
}

function failureMessage(message){
    let result= new Object({
        "success": false,
        "message": message
    })
    return result;
}

function userSuccess(data){
    return {
        'success': true,
        data
    }
}

function success(){
    let result= new Object({
        success: true
    })
    return result;
}

function failure(){
    let result= new Object({
        success: false
    })
    return result;
}

module.exports = { successMessage, failureMessage, userSuccess, success, failure };