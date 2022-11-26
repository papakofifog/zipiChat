const ErrorResponse = require('../../util/errorResponse')

const errorHandler= async (err, req, res, next)=>{
    console.error(err);

    let error = {...err}

    error.message= err.message;

    // handle errors
    if(err.name === 'CastError') {
        message="Resource not found"
        processError(message)

    }
    if(err.code=== 11000){
        message="Duplicate field value entered"
        processError(message)
    }
    if(err.name=== 'ValidationError'){
        let message= Object.values(err.errors).map(value =>value.message)
        processError(message)
    }

    res.status(error.statusCode || 500).json({
        success: false,
        error:error.message || 'Server Error'
    })

    
}

const processError=(errMessage)=>{
    const message=errManage
    error= new ErrorResponse(message,400)
    return errors
}


module.exports= errorHandler;
