const cors = (req, res, next) => {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');

    // Request methods you wish to allow
   res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE');

    // Request headers you wish to allow
   // res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Pass to next layer of middleware
    next();
}

module.exports = cors;
