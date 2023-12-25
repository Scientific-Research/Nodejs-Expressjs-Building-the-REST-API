const { v4: uuidv4 } = require("uuid");

const DUMMY_USERS = [
  {
    id: "u1",
    name: "Max Schwarz",
    email: "test@test.com",
    password: "testers",
  },
];

module.exports.getUsers = (req, res, next) => {
  //   DUMMY_USERS.map((u) => u.email);
  res.status(200).json({ message: "User Information:", users: DUMMY_USERS });
};

module.exports.signup = (req, res, next) => {
  const { name, email, password } = req.body;

  const createdUser = {
    id: uuidv4(),
    name, // name:name
    email,
    password,
  };

  DUMMY_USERS.push(createdUser);
  console.log(DUMMY_USERS);
  res.status(201).json({ message: "User created", user: createdUser });
};

module.exports.login = (req, res, next) => {};
