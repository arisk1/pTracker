const express = require('express');
require('./db/mongoose');
const cors = require('./middleware/cors.js');


const app = express();
app.use(cors);
app.use(express.json());
/***  ENDPOINTS ***/

const baseURL = process.env.BASE_URL || ''

//home
const homeRouter = require('./routers/home');
app.use(`${baseURL}/home`, homeRouter);

//users
const usersRouter = require('./routers/users');
app.use(`${baseURL}/users`, usersRouter);

//portfolios
const portfolioRouter = require('./routers/portfolio');
app.use(`${baseURL}/portfolios`, portfolioRouter);


module.exports = app
