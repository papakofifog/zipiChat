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

module.exports = { successMessage, failureMessage, userSuccess };