const express = require('express');
require('./db/mongoose');
const cors = require('./middleware/cors.js');


const app = express();
app.use(cors);
app.use(express.json());
/***  ENDPOINTS ***/
//home
const homeRouter = require('./routers/home');
app.use(homeRouter);

//users
const usersRouter = require('./routers/users');
app.use(usersRouter);

//portfolios
const portfolioRouter = require('./routers/portfolio');
app.use(portfolioRouter);


module.exports = app
