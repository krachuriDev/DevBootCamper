const logger = (req, res, next )=> {
    req.userName='Karthik Rachuri';
    console.info(`Request method is ${req.method} & Request url is ${req.url}`);
    next();
};

module.exports = logger;