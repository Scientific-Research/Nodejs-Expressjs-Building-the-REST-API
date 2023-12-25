const { v4: uuidv4 } = require("uuid");
const HttpError = require("../models/http-error");

const DUMMY_PLACES = [
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
];

module.exports.getPlaceById = (req, res, next) => {
  const placeId = req.params.pid; // { pid: 'p1' }
  // console.log("GET Request in Places!");
  const place = DUMMY_PLACES.find((p) => placeId === p.id);
  console.log(place);
  // res.json({ message: "It works!" }).status(200);
  // res.json({ place: place }).status(200);
  if (!place) {
    // return res
    //   .status(404)
    //   .json({ message: "Could not find a place for the provided place id!" });
    // const error = new Error("Could not find a place for the provided id.");
    // error.code = 404;
    // throw error;

    const error = new HttpError(
      "Could not find a place for the provided id.",
      404
    );
    throw error;
  }
  res.json({ place }).status(200); // => {place} => {place:place}
};

module.exports.getPlaceByUserId = (req, res, next) => {
  const userId = req.params.uid;
  console.log(userId);
  const user = DUMMY_PLACES.find((user) => user.creator === userId);
  console.log(user);
  // res.json({ user: user });
  if (!user) {
    // return res
    //   .status(404)
    //   .json({ message: "Could not find a place for the provided user id!" });
    // const error = new Error("Could not find a user for the provided id.");
    // error.code = 404;
    // return next(error);
    // throw error;
    const error = new HttpError(
      "Could not find a user for the provided id.",
      404
    );
    return next(error);
  }
  res.json({ user });
};

module.exports.createPlace = (req, res, next) => {
  // using deconstruction:
  const { title, description, creator, address, coordinates } = req.body;

  // or using this classic way:
  // title = req.body.title;
  // description = req.body.description;
  // creator = req.body.creator;
  // address = req.body.address;
  // location = req.body.coordinates;

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

module.exports.deletePlace = (req, res, next) => {};

// module.exports.getPlaceById = getPlaceById;
// module.exports.getPlaceByUserId = getPlaceByUserId;
