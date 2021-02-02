const CORS = {
  origin: 'https://lbratkovskaya.github.io',
  credentials: true,
  'Access-Control-Allow-Credentials': true
};

const PORT = process.env.PORT || 3000;

module.exports = {
  CORS,
  PORT,
}
