const dotenv = require("dotenv");
dotenv.config();

const DB_USER = process.env.DB_USER;
const DB_PASSWORD = process.env.DB_PASSWORD;
const DB_NAME = process.env.DB_NAME;
const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;
const JWT_KEY = process.env.JWT_KEY;
const PORT = process.env.PORT;

module.exports = {
  DB_USER,
  DB_PASSWORD,
  DB_NAME,
  GOOGLE_API_KEY,
  JWT_KEY,
  PORT,
};
