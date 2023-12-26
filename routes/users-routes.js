const express = require("express");
const router = express.Router();

const { getUsers, signup, login } = require("../controllers/users-controller");

// oder
// const placesControllers = require("../controllers/places-controller");

// /api/users/p1
router.get("/", getUsers);
router.post("/signup", signup);
router.post("/login", login);

module.exports = router;
