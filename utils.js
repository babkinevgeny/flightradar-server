const CORS = {
  origin: 'http://localhost:3000',
  credentials: true,
};

const PORT = process.env.PORT || 3000;

module.exports = {
  CORS,
  PORT,
}
