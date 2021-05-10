const express = require('express');
require('./db/mongoose');
const cors = require('./middleware/cors.js');


const app = express();
app.use(cors);
app.use(express.json());
/***  ENDPOINTS ***/
//home
const homeRouter = require('./routers/home');
app.use('/p-tracker-api/home', homeRouter);

//users
const usersRouter = require('./routers/users');
app.use('/p-tracker-api/users', usersRouter);

//portfolios
const portfolioRouter = require('./routers/portfolio');
app.use('/p-tracker-api/portfolios', portfolioRouter);


module.exports = app
