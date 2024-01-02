const { validationResult } = require("express-validator");
const HttpError = require("../models/http-error");
const { getCoordsForAddress } = require("../util/location");
const mongoose = require("mongoose");
const Place = require("../models/place");
const User = require("../models/user");

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
  // let places;
  let userWithPlaces;
  try {
    // const places = await Place.find((p) => p.creator === userId);
    // places = await Place.find({ creator: userId }); // find() give us an array
    userWithPlaces = await User.findById(userId).populate("places"); // give us all places
    // for one user!
    console.log(userWithPlaces);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, please try again later!",
      500
    );
    return next(error);
  }
  // if (!places || places.length === 0)
  if (!userWithPlaces || userWithPlaces.places.length === 0) {
    const error = new HttpError(
      "Could not find place(s) for the provided id!",
      500
    );
    return next(error);
  }
  res.status(200).json({
    places: userWithPlaces.places.map((place) =>
      place.toObject({ getters: true })
    ),
  });
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
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/1/10/Empire_State_Building_%28aerial_view%29.jpg/400px-Empire_State_Building_%28aerial_view%29.jpg", // => File Upload module, will be replaced with real image url,
    address,
    location: coordinates,
    creator,
  });

  ///////////// Creating Places & Adding it to a User////////////////////////
  let user;
  try {
    user = await User.findById(creator);
  } catch (err) {
    const error = new HttpError(
      "Creating place failed, plesae check your data carefully!",
      500
    );
    return next(error);
  }
  if (!user) {
    const error = new HttpError("Could not find user for provided id", 404);
    return next(error);
  }
  console.log(user);

  try {
    // await createdPlace.save();
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await createdPlace.save({ session: sess });
    user.places.push(createdPlace);
    await user.save({ session: sess });
    await sess.commitTransaction();
    ///////////// Creating Places & Adding it to a User////////////////////////
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
    // throw new HttpError("Invalid inputs passed, plesae check your data!", 422);
    const error = new HttpError(
      "Invalid inputs passed, plesae check your data!",
      422
    );
    return next(error);
  }
  // // first of all, we have to get the Place
  const placeId = req.params.pid;
  const { title, description } = req.body;
  let updatedPlace;
  try {
    updatedPlace = await Place.findById(placeId);
    console.log("before updating title and description:" + updatedPlace);
    updatedPlace.title = title;
    updatedPlace.description = description;
    console.log("after updating title and description:" + updatedPlace);
    await updatedPlace.save();
  } catch (err) {
    const error = new HttpError(
      "Updating place failed, plesae check your data carefully!",
      500
    );
    return next(error);
  }
  res.status(200).json({
    message: "Updated Place: ",
    Place: updatedPlace.toObject({ getters: true }),
  });
};

module.exports.deletePlace = async (req, res, next) => {
  const placeId = req.params.pid;
  console.log(placeId);

  let place;

  try {
    place = await Place.findById(placeId).populate("creator");
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, Could not find a place for that id!",
      500
    );
    return next(error);
  }

  if (!place) {
    const error = new HttpError(
      "It was already deleted! Could not find a place for that id!",
      404
    );
    return next(error);
  }
  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await place.deleteOne({ session: sess });
    place.creator.places.pull(place);
    await place.creator.save({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    const error = new HttpError(
      "Deleting place failed, Could not find a place for that id!",
      500
    );
    console.log(err);
    return next(error);
  }
  res.status(200).json({
    message: "Place was deleted successfully! ",
  });
};
