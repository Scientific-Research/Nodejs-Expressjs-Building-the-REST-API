// const { v4: uuidv4 } = require("uuid");
const { validationResult } = require("express-validator");
const HttpError = require("../models/http-error");
const User = require("../models/user");

module.exports.getUsers = async (req, res, next) => {
  let users;
  try {
    users = await User.find({}, "email name"); // one way
    // users = await User.find({}, "-password"); // second way
  } catch (err) {
    const error = new HttpError(
      "Fetching users failed, please try again later!",
      500
    );
    return next(error);
  }
  res
    .status(200)
    .json({ users: users.map((user) => user.toObject({ getters: true })) });
};

module.exports.signup = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors);
    // throw new HttpError("Invalid inputs passed, plesae check your data!", 422);
    const error = new HttpError(
      "Invalid inputs passed, plesae check your data!",
      422
    );
    return next(error); // with throw new ... we will have an error in VSCODE Terminal and this is bad!
  }

  // const { name, email, password, image, places } = req.body;
  const { name, email, password, image } = req.body; // places now are as an array
  // in user.js, we have unique:true for email, but it doesn't show us the problem
  // but here it shows us the error in Terminal clearly!

  let userExistsAlready;
  try {
    userExistsAlready = await User.findOne({ email });
  } catch (err) {
    const error = new HttpError(
      "Signing up failed, please try again later!",
      500
    );
    return next(error);
  }

  if (userExistsAlready) {
    const error = new HttpError(
      "Email already exists, pick up a new one!",
      422
    );
    return next(error);
  }

  const createdUser = new User({
    // id: uuidv4(),
    name, // name:name
    email,
    password,
    image,
    // places,
    places: [], // one user can have multiple places
  });
  try {
    await createdUser.save();
  } catch (err) {
    const error = new HttpError(
      "Signing up failed, plesae check your data carefully!",
      500
    );
    return next(error);
  }
  res.status(201).json({ User: createdUser.toObject({ getters: true }) });
  // res.status(200).json({ message: "Our created User:", User: createdUser });
};

module.exports.login = async (req, res, next) => {
  const { email, password } = req.body;
  let identifiedUser;

  try {
    identifiedUser = await User.findOne({ email });
  } catch (err) {
    const error = new HttpError(
      "Signing failed, plesae check your data carefully!",
      500
    );
    return next(error);
  }
  if (!identifiedUser || identifiedUser.password !== password) {
    const error = new HttpError(
      "Could not identify the user, credentials seem to be wrong!",
      401
    );
    // throw error;
    return next(error);
  }
  res.status(200).json({ message: "User logged in!:", user: identifiedUser });
};
