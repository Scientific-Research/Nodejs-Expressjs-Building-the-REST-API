const express = require("express");
const router = express.Router();

const {
  getPlaceById,
  getPlaceByUserId,
  createPlace,
} = require("../controllers/places-controller");

// oder
// const placesControllers = require("../controllers/places-controller");

// /api/places/p1
router.get("/:pid", getPlaceById);
router.get("/user/:uid", getPlaceByUserId);

// oder
// router.get("/:pid", placesControllers.getPlaceById);
// router.get("/user/:uid", placesControllers.getPlaceByUserId);

router.post("/", createPlace);
module.exports = router;
