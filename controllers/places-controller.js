const { v4: uuidv4 } = require("uuid");
const { validationResult } = require("express-validator");
const HttpError = require("../models/http-error");
const { getCoordsForAddress } = require("../util/location");

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

module.exports.getPlaceById = (req, res, next) => {
  const placeId = req.params.pid;
  const place = DUMMY_PLACES.find((p) => placeId === p.id);
  console.log(place);

  if (!place) {
    const error = new HttpError(
      "Could not find a place for the provided id.",
      404
    );
    throw error;
  }
  res.json({ place }).status(200); // => {place} => {place:place}
};

module.exports.getPlacesByUserId = (req, res, next) => {
  const userId = req.params.uid;
  console.log(userId);
  const places = DUMMY_PLACES.filter((p) => p.creator === userId);
  console.log(places);

  if (!places || places.length === 0) {
    const error = new HttpError(
      "Could not find places for the provided user id.",
      404
    );
    return next(error);
  }
  res.json({ places });
};

module.exports.createPlace = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors);
    // res.status(422).json({ message: "ERROR!", Error: errors });
    // throw new HttpError("Invalid inputs passed, plesae check your data!", 422);
    return next(
      new HttpError("Invalid inputs passed, plesae check your data!", 422)
    );
  }
  // using deconstruction:
  // const { title, description, creator, address, coordinates } = req.body;
  const { title, description, creator, address } = req.body;

  let coordinates;
  try {
    coordinates = await getCoordsForAddress(address);
  } catch (error) {
    return next(error);
  }

  // or using this classic way:
  // title = req.body.title;
  // description = req.body.description;
  // creator = req.body.creator;
  // address = req.body.address;
  // location = req.body.coordinates;

  // manual validation without using express-validator:
  // if (title.trim().length === 0) {
  // }

  const createdPlace = {
    id: uuidv4(),
    title,
    description,
    creator,
    address,
    location: coordinates,
  };
  DUMMY_PLACES.push(createdPlace);
  console.log(DUMMY_PLACES); // shows us old Dummy_Places + createdPlace
  res.status(201).json({ place: createdPlace });
};

module.exports.updatePlace = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors);
    throw new HttpError("Invalid inputs passed, plesae check your data!", 422);
  }
  // // first of all, we have to get the Place
  const placeId = req.params.pid;
  const { title, description } = req.body;

  let updatedPalce = DUMMY_PLACES.find((p) => placeId === p.id);
  let placeIndex = DUMMY_PLACES.findIndex((p) => placeId === p.id);

  updatedPalce = {
    // title and description will be updated - via req.body
    title: title,
    description: description,
    // these data will not be updated and remain as same data as before!
    id: updatedPalce.id,
    location: updatedPalce.location,
    address: updatedPalce.address,
    creator: updatedPalce.creator,
  };

  DUMMY_PLACES[placeIndex] = updatedPalce;
  console.log(DUMMY_PLACES);

  res.status(200).json({ message: "Updated Place: ", place: updatedPalce });
  // res.status(200).json({ place: updatedPalce });
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
