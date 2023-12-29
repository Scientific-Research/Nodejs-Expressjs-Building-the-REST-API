const { validationResult } = require("express-validator");
const HttpError = require("../models/http-error");
const { getCoordsForAddress } = require("../util/location");
const Place = require("../models/place");
const place = require("../models/place");

let DUMMY_PLACES = [
  {
    id: "p1",
    title: "Empire State Building",
    description: "one of the most famous sky scrapers in the World!",
    location: {
      lat: 40.7484405,
      lng: -73.9856644,
    },
    address: "20 W 34th St., New York, NY 10001, United States",
    creator: "u1",
  },
  {
    id: "p2",
    title: "Empire State Building",
    description: "one of the most famous sky scrapers in the World!",
    location: {
      lat: 40.7484405,
      lng: -73.9856644,
    },
    address: "20 W 34th St., New York, NY 10001, United States",
    creator: "u1",
  },
];

module.exports.getPlaceById = async (req, res, next) => {
  const placeId = req.params.pid;
  console.log(placeId);

  try {
    // const place = await Place.findOne((p) => p.id === placeId); this doesn't work!
    // const place = await Place.findOne({ _id: placeId }); this works too!
    const place = await Place.findById(placeId);
    console.log(place);
    if (place.length !== 0) {
      return res.status(200).json({
        Message: "This Place retrieved from Database: ",
        // Place: place,
        Place: place.toObject({ getters: true }), // give us the _id as id in string format
      });
    }
  } catch (err) {
    const error = new HttpError(
      "Could not find a place for the provided id.",
      422
    );
    return next(error);
  }
};

module.exports.getPlacesByUserId = async (req, res, next) => {
  const userId = req.params.uid;
  console.log(userId);
  try {
    // const places = await Place.find((p) => p.creator === userId);
    const places = await Place.find({ creator: userId }); // find() give us an array
    console.log(places);
    if (places.length !== 0) {
      return res.status(200).json({
        Message: "These Places retrieved from Database: ",
        // Places: places,
        Places: places.map((place) => place.toObject({ getters: true })),
      });
    }
  } catch (err) {
    const error = new HttpError(
      "Could not find place(s) for the provided user id.",
      422
    );
    return next(error);
  }
  return res
    .status(422)
    .json({ Message: "Could not find place(s) for the provided id!" });
};

module.exports.createPlace = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors);
    return next(
      new HttpError("Invalid inputs passed, plesae check your data!", 422)
    );
  }
  // using destructuring:
  const { title, description, image, address, creator } = req.body;

  let coordinates;
  try {
    coordinates = await getCoordsForAddress(address);
  } catch (error) {
    return next(error);
  }
  const createdPlace = new Place({
    title,
    description,
    image,
    address,
    location: coordinates,
    creator,
  });
  try {
    await createdPlace.save();
  } catch (err) {
    const error = new HttpError(
      "Creating place failed, plesae check your data carefully!",
      500
    );
    return next(error);
  }
  res.status(200).json({ message: "Our created Place:", Place: createdPlace });
};

module.exports.updatePlace = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors);
    throw new HttpError("Invalid inputs passed, plesae check your data!", 422);
  }
  // // first of all, we have to get the Place
  const placeId = req.params.pid;
  const { title, description } = req.body;

  let updatedPlace = await Place.findById(placeId);

  try {
    updatedPlace.title = title;
    updatedPlace.description = description;
    await updatedPlace.save();
  } catch (err) {
    const error = new HttpError(
      "Updating place failed, plesae check your data carefully!",
      500
    );
    return next(error);
  }
  res.status(200).json({ message: "Updated Place: ", Place: updatedPlace });
};

module.exports.deletePlace = (req, res, next) => {
  const placeId = req.params.pid;
  if (!DUMMY_PLACES.find((p) => p.id === placeId)) {
    throw new HttpError("Could not find a place for that id!", 404);
  }
  // console.log(placeId);

  DUMMY_PLACES = DUMMY_PLACES.filter((p) => p.id !== placeId);
  console.log(DUMMY_PLACES);

  res.status(200).json({ message: "remainingPlaces:", place: DUMMY_PLACES });
};

// module.exports.getPlaceById = getPlaceById;
// module.exports.getPlaceByUserId = getPlaceByUserId;
