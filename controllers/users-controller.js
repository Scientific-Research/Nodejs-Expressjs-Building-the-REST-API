// const { v4: uuidv4 } = require("uuid");
const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const HttpError = require("../models/http-error");
const User = require("../models/user");

module.exports.getUsers = async (req, res, next) => {
  let users;
  try {
    // users = await User.find({}, "name email image places"); // one way
    users = await User.find({}, "-password"); // second way => find all things but password!
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
  const { name, email, password } = req.body; // places now are as an array
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

  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hash(password, 12);
  } catch (err) {
    const error = new HttpError(
      "Could not create user, please try again!",
      500
    );
    return next(error);
  }

  const createdUser = new User({
    // id: uuidv4(),
    name, // name:name
    email,
    password: hashedPassword,
    // image: "https://live.staticflickr.com/7631/26849088292_36fc52ee90_b.jpg",
    // image: "http://localhost:5000/" + req.file.path, // req.file.path is uploads/images/filename
    image: req.file.path, // req.file.path is uploads/images/filename => we do the link in frontend
    // in UserItem.jsx =>  image={`http://localhost:5000/${props.image}`}
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

  // *************this setion is almost the same in login and signup sections!*************
  let token;
  try {
    token = jwt.sign(
      // we create token only with Id and
      // email and not with password
      { userId: createdUser.id, email: createdUser.email },
      "supersecret_dont_share0485762893465783465", // our private key
      { expiresIn: "1h" }
    );
  } catch (err) {
    const error = new HttpError(
      "Signing up failed, please try again later!",
      500
    );
    return next(error);
  }

  res
    .status(201)
    // we send only the userId, email and token to the browser and not password and even
    // not password in the Token,'cause, Token doesn't have email inside :)

    .json({ userId: createdUser.id, email: createdUser.email, token: token });
  // res.status(201).json({ user: createdUser.toObject({ getters: true }) });
  // res.status(200).json({ message: "Our created User:", User: createdUser });

  // *************this setion is almost the same in login and signup sections!*************
};

module.exports.login = async (req, res, next) => {
  const { email, password } = req.body;
  let identifiedUser;

  try {
    identifiedUser = await User.findOne({ email });
  } catch (err) {
    const error = new HttpError(
      "Logging in failed, plesae check your data carefully!",
      500
    );
    return next(error);
  }
  // if (!identifiedUser || identifiedUser.password !== password) {
  if (!identifiedUser) {
    const error = new HttpError(
      "Invalid credentials, could not log you in!",
      403
    );
    // throw error;
    return next(error);
  }

  let isValidPassword = false;
  // comparing the plain text pasword with hashed password!
  // password is plain text password , identified.password is hashed password
  // the result at the end is boolean which is stored in isValidPassword variable.
  try {
    isValidPassword = await bcrypt.compare(password, identifiedUser.password);
  } catch (err) {
    const error = new HttpError(
      "Could not log you in, please check your credentials and try again!",
      500
    );
    return next(error);
  }

  if (!isValidPassword) {
    const error = new HttpError(
      "Invalid credentials, could not log you in!",
      403
    );
    // throw error;
    return next(error);
  }

  // *************this setion is almost the same in login and signup sections!*************
  let token;
  try {
    token = jwt.sign(
      { userId: identifiedUser.id, email: identifiedUser.email },
      "supersecret_dont_share0485762893465783465", // our private key
      { expiresIn: "1h" }
    );
  } catch (err) {
    const error = new HttpError(
      "Logging in failed, please try again later!",
      500
    );
    return next(error);
  }

  res.status(201).json({
    userId: identifiedUser.id,
    email: identifiedUser.email,
    token: token,
  });

  // *************this setion is almost the same in login and signup sections!*************

  // res.status(200).json({
  //   message: "User logged in!:",
  //   user: identifiedUser.toObject({ getters: true }),
  // });
};
