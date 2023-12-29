const { v4: uuidv4 } = require("uuid");
const { validationResult } = require("express-validator");
const HttpError = require("../models/http-error");
const User = require("../models/user");

const DUMMY_USERS = [
  {
    id: "u1",
    name: "Max Schwarz",
    email: "test@test.com",
    password: "testers",
  },
];

module.exports.getUsers = async (req, res, next) => {
  //   DUMMY_USERS.map((u) => u.email);
  //   res.status(200).json({ message: "User Information:", users: DUMMY_USERS });
  const user = await User.find();
  res.status(200).json({ users: user });
};

module.exports.signup = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors);
    throw new HttpError("Invalid inputs passed, plesae check your data!", 422);
  }

  const { name, email, password } = req.body;
  const hasUser = DUMMY_USERS.find((u) => u.email === email);

  if (hasUser) {
    const error = new HttpError(
      "Could not create user, email already exists!",
      422
    );
    throw error;
  }

  const createdUser = {
    id: uuidv4(),
    name, // name:name
    email,
    password,
  };

  DUMMY_USERS.push(createdUser);
  console.log(DUMMY_USERS);
  //   res.status(201).json({ message: "User created", user: createdUser });
  res.status(201).json({ user: createdUser });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  const identifiedUser = DUMMY_USERS.find((u) => u.email === email);
  //   console.log(identifiedUser);

  if (!identifiedUser || identifiedUser.password !== password) {
    const error = new HttpError(
      "Could not identify the user, credentials seem to be wrong",
      401
    );
    throw error;
    // return next(error);
  }
  res.status(200).json({ message: "User logged in!:", user: identifiedUser });
};
