const express = require('express');
const https = require('https');

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

apiRouter.route('/rating').get(async (req, res) => {
  await https.get(`https://www.flightradar24.com/airports/myfr24-ratings?iata=${req.query.airportCode}`, responseHandler(res))
});

apiRouter.route('/flag').get(async (req, res) => {
  await https.get(`https://www.countryflags.io/${req.query.countryCode}/flat/64.png`, responseHandler(res))
});

module.exports = apiRouter;
