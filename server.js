const express = require('express');
const dotenv = require('dotenv');

///Load env vars

dotenv.config({ path: './config/config.env' });

const app = express();

const PORT = process.env.PORT || 8080;

app.listen(PORT, console.info(`Server is running in ${process.env.NODE_ENV} and running on port ${PORT}`));