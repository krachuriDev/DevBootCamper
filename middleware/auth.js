const jwt = require('jsonwebtoken');
const asyncHandler = require('./asyncHandler');
const User = require('../models/Users');
const ErrorResponse = require('../utils/ErrorResponse');

exports.protected = asyncHandler(async (req, res, next) => {

    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {

        token = req.headers.authorization.split(' ')[1];
    }
    
    if (!token) {
        return next(new ErrorResponse('User is not authorized to access this resource', 401));
    }

    // getting token using cookie
    // else if (req.cookies.token) {
    //     token = req.cookies.token;
    // }

    try {
        //verify token

        const jwtPayload = jwt.verify(token, process.env.JWT_SECRET);

        console.info(jwtPayload);

        req.user = await User.findById(jwtPayload.id);

        next();
    } catch (err) {
        return next(new ErrorResponse('User is not authorized to access this resource', 401));
    }

});

// Grant access to specific roles
exports.authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(new ErrorResponse(`User role ${req.user.role} has no permissions to access the resource`), 403);
        }
        next();
    }
}

