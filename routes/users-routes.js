const { Router } = require("express");
const router = Router();

// const exprees = require("express");
// const router = express.Router();

const { check } = require("express-validator");

const { getUsers, signup, login } = require("../controllers/users-controller");

// oder
// const placesControllers = require("../controllers/places-controller");

// /api/users/p1
router.get("/", getUsers);
router.post(
  "/signup",
  [
    check("name").not().isEmpty(),
    check("email")
      .normalizeEmail() // Test@test.com => test@test.com
      .isEmail(),
    check("password").isLength({ min: 6 }),
  ],
  signup
);
router.post("/login", login);

module.exports = router;
