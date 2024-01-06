const axios = require("axios");
const config = require("../config.js");
const HttpError = require("../models/http-error");

// const API_KEY = "AIzaSyAu5FGH8o4-lbmtbivywRtcIJt8rOSaL8U";
const API_KEY = config.GOOGLE_API_KEY;

module.exports.getCoordsForAddress = async (address) => {
  const response = await axios.get(
    `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
      address
    )}&key=${API_KEY}`
  );
  const data = response.data;
  if (!data || data.status === "ZERO_RESULTS") {
    const error = new HttpError(
      "Could not find location for the specified address.",
      422
    );
    throw error;
  }
  const coordinates = data.results[0].geometry.location;
  return coordinates;
};
