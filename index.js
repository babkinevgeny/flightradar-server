const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const passport = require('passport');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const bodyParser = require('body-parser');
const authRouter = require('./auth/router');
const apiRouter = require('./api/router');
const { CORS, PORT } = require('./utils');
const DB = require('./db');

const app = express();

mongoose.connect(DB, { useNewUrlParser: true, useUnifiedTopology: true }, (err) => {
  if (err) {
    throw err;
  } 

  console.log('MongoDB is connected');
});

app
  .use(cors(CORS))
  .use(bodyParser.json())
  .use(bodyParser.urlencoded({extended: true}))
  .use(session({
    secret: "rsclone",
    resave: true,
    saveUninitialized: true,
  }))
  .use(cookieParser("rsclone"))
  .use(passport.initialize())
  .use(passport.session())
  .use('/auth', authRouter)
  .use('/api', apiRouter);

require('./passportConfig')(passport);

app.get('/', (req, res) => res.send('<h1>Hello FlightRadarClone</h1>'));

app.listen(PORT, () => {
    console.log(`used ${PORT} port for server`);
});
