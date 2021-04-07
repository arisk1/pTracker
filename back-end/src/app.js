const express = require('express');
require('./db/mongoose');


const app = express();

app.use(express.json());
/***  ENDPOINTS ***/
//home
const homeRouter = require('./routers/home');
app.use(homeRouter);

//users
const usersRouter = require('./routers/users');
app.use(usersRouter);


module.exports = app
