const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const connectDB = require('./config/db');
const colors = require('colors');
const errorHandler = require('./middleware/error');
const cookieParser = require('cookie-parser');
const xss = require('xss-clean');
const rateLimit = require('express-rate-limit');
const hpp = require('hpp');
const cors = require('cors');
const mongoSanitize = require('express-mongo-sanitize');

// Load Route files
const bootcamps = require('./routes/bootcamp');
const auth = require('./routes/auth');
const courses = require('./routes/course');

///Load env variables
dotenv.config({ path: './config/config.env' });

/// Connect to DB.

connectDB();

const app = express();

app.use(express.json());

//add cookieParser middleware
app.use(cookieParser());

// Prevent xss attacks
app.use(xss());

// Rate limiting
const limiter = rateLimit({
    windowMs: 10 * 60 * 1000, // 10 minutes
    max: 100
});

app.use(limiter);

// Prevent http param pollution
app.use(hpp());

// Enable CORS

app.use(cors());

// Dev logging middleware
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// Mount the routers.

app.use('/api/v1/bootcamps', bootcamps);
app.use('/api/v1/auth', auth);
app.use('/api/v1/courses', courses);

// Saniitize data
app.use(mongoSanitize);

// add the error middleware
app.use(errorHandler);

const PORT = process.env.PORT || 8080;

const server = app.listen(
    PORT,
    console.info(`Server is running in ${process.env.NODE_ENV} and running on port ${PORT}`.blue.bold)
);

process.on('unhandledrejection', (err) => {
    console.info(err.message);
    /// Close the server & exit the process.

    server.close(() => { process.exit(1) });
})