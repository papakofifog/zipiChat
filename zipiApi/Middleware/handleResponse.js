function successMessage(message,data='No data requested',token='verified'){
    return {
        "success": true,
        "message": message,
        "data":data,
        "token":token
    }
}

function failureMessage(message){
    return {
        "success": false,
        "message": message
    }
}

module.exports = { successMessage, failureMessage };