const ErrorResponse = require('../utils/ErrorResponse');

const errorHandler = (err, req, res, next) => {
    
    console.info(err);

    let error = {...err};
    error.message = err.message;
    
    //Mongoose bad Object Id
    if (err.name === 'CastError') {
        const message = `Resource not found for the id ${err.value}`;
        error = new ErrorResponse(message, 404);
    }

    //Mongoose Duplicate Key
    if(err.code===11000){
        const message='Duplicate field value entered';
        error=new ErrorResponse(message,400);
    }

    //Mongoose validation error
    if(err.name==='ValidationError')
        {
            const message=Object.values(err.errors).map(val=>val.message);
            error=new ErrorResponse(message,400);
        }


    res.status(error.statusCode || 500).json({
        success: false,
        data: error.message || 'Server Error'
    });
}

module.exports = errorHandler;