const express = require('express');
const cors = require('cors');
const https = require('https');
const mongoose = require('mongoose');
const passport = require('passport');
const passportLocal = require('passport-local').Strategy;
const cookieParser = require('cookie-parser');
const bcrypt = require('bcryptjs');
const session = require('express-session');
const bodyParser = require('body-parser');
const User =  require('./user');

const app = express();

const uri = "mongodb+srv://dbuser:dbpassword@cluster0.7s7qp.mongodb.net/rsclone?retryWrites=true&w=majority";


mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true }, (err) => {
  if (err) {
    throw err
  } else {
    console.log('MongoDB is connected');
  }
});

app.use(cors({
  origin: 'https://infinite-forest-56486.herokuapp.com',
  credentials: true,
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(session({
  secret: "rsclone",
  resave: true,
  saveUninitialized: true,
}));
app.use(cookieParser("rsclone"));
app.use(passport.initialize());
app.use(passport.session());

app.get('/', (req, res) => {
  res.send('<h1>Hello, FlightRadarClone</h1>')
});

require('./passportConfig')(passport);

const authRouter = express.Router();

authRouter.route('/register').post((req, res) => {
  const { username, password } = req.body

  User.findOne({ username }, async (err, doc) => {
    if (err) throw err;

    if (doc) {
      res.send(`User ${req.body.username} already exists`);
    } else {

      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = new User({
        username,
        password: hashedPassword
      });

      await newUser.save();
      res.send(`User ${req.body.username} was created`);
    }
  });
});

authRouter.route('/login').post((req, res, next) => {
  passport.authenticate('local', (err, user) => {
    if (err) throw err;
    if (!user) {
      res.send('Wrong data. Change username or password');
    } else {
      req.logIn(user, (err) => {
        if (err) throw err;
        res.send('Authentication succeed');
        console.log(req.user);
      })
    }
  })(req, res, next);
});

authRouter.route('/current_user').get((req, res) => {
  res.send(req.user);
});

app.use('/auth', authRouter);

const apiRouter = express.Router();

apiRouter.route('/flights').get( async (req, res) => {
    await https.get(`https://data-live.flightradar24.com/zones/fcgi/feed.js?bounds=${req.query.bounds}&faa=1&satellite=1&mlat=1&flarm=1&adsb=1&gnd=0&air=1&vehicles=1&estimated=1&maxage=14400`, responseHandler(res))
});

apiRouter.route('/allAirports').get( async (req, res) => {
  await https.get('https://www.flightradar24.com/_json/airports.php', responseHandler(res))
});

apiRouter.route('/airport').get( async (req, res) => {
  await https.get(`https://api.flightradar24.com/common/v1/airport.json?code=${req.query.airportCode}&plugin[]=details&plugin[]=runways&plugin[]=satelliteImage&plugin[]=scheduledRoutesStatistics&plugin[]=weather&plugin-setting[satelliteImage][scale]=1`, responseHandler(res))
});

apiRouter.route('/schedule').get( async (req, res) => {
  await https.get(`https://api.flightradar24.com/common/v1/airport.json?code=${req.query.airportCode}&plugin[]=schedule&plugin-setting[schedule][mode]=${req.query.mode}&plugin-setting[schedule][timestamp]=${req.query.timestamp}&page=1&limit=100`, responseHandler(res))
});

apiRouter.route('/flightStatus').get( async (req, res) => {
  await https.get(`https://data-live.flightradar24.com/clickhandler/?version=1.5&flight=${req.query.flightId}`, responseHandler(res))
});

app.use('/api', apiRouter);

app.listen(3000, () => {
    console.log('used 3000 port for server');
})

function responseHandler(res) {
  return (resp) => {
    let data = '';

    // A chunk of data has been received.
    resp.on('data', (chunk) => {
      data += chunk;
    });

    // The whole response has been received. Print out the result.
    resp.on('end', () => {
      res.send(data);
    });
  };
}
