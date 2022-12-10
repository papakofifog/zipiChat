const ErrorResponse = require('../../util/errorResponse')

const errorHandler= async (err, req, res, next)=>{
    console.error(err);
    console.log(err.code);
    let error = {...err}

    error.message= err.message;

    // handle errors
    if(err.name === 'CastError') {
        message="Resource not found"
        processError(message)

    }
    if(err.code == 11000){
        let concernedItem=Object.keys(err.keyValue)[0];
        message=`${ concernedItem } value is already taken`;
        error.message=processError(message).message
    }
    if(err.name === 'ValidationError'){
        let message= Object.values(err.errors).map(value =>value.message)
        error.message=processError(message).message
    }
    
    res.status(error.statusCode || 200).json({
        success: false,
        message:error.message || 'Server Error'
    })

    
}

const processError=(errMessage)=>{
    const message=errMessage;
    error= new ErrorResponse(message,400)
    return error;
}


module.exports= errorHandler;
