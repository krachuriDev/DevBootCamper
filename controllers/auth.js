const asyncHandler = require('../middleware/asyncHandler');
const User = require('../models/Users');
const ErrorResponse = require('../utils/ErrorResponse');


// @desc Register a user
// @route POST api/v1/auth/Register
// @access Public

exports.register = asyncHandler(async (req, res, next) => {
    const { name, email, password, role } = req.body;
    const user = await User.create({
        name,
        email,
        role,
        password
    });

    sendCookieToken(user, 200, res);
});


// @desc Login user
// @route POST api/v1/auth/Register
// @access Public
exports.login = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return next(new ErrorResponse('Please enter email/password', 400));
    }

    const user = await User.findOne({ email }).select('+password');

    if (!user) {
        return next(new ErrorResponse('Invalid credentials', 401));
    }

    const isPasswordMatch = await user.matchPassword(password);

    if (!isPasswordMatch) {
        return next(new ErrorResponse('Invalid credentials', 401));
    }

    sendCookieToken(user, 200, res);
});

// @desc Logout user
// @route GET api/v1/auth/logout
// @access Public

exports.logout = asyncHandler(async (req, res, next) => {

    res.cookie('token', 'none', {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true
    });

    res.status(200).json({
        success: true,
        data: {}
    })
})

const sendCookieToken = (user, statusCode, res) => {
    const token = user.getSignedJwtToken();
    const options = {
        expires: new Date(Date.now() + (process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000)),
        httpOnly: true
    }

    if (process.env.NODE_ENV === 'production') {
        options.secure = true;
    }

    res.
        status(statusCode)
        .cookie('token', token, options)
        .json({
            success: true,
            token
        });
}

// @desc Get the loggedIn user
// @route POST api/v1/auth/getMe
// @access Private
exports.getMe = asyncHandler(async (req, res, next) => {

    const user = await User.findById(req.user.id);

    res.status(200).json({
        success: true,
        data: user
    });
})



