const express = require("express");
const router = express.Router();

const {
  getPlaceById,
  getPlacesByUserId,
  createPlace,
  updatePlace,
  deletePlace,
} = require("../controllers/places-controller");

// oder
// const placesControllers = require("../controllers/places-controller");

// /api/places/p1
router.get("/:pid", getPlaceById);
router.get("/user/:uid", getPlacesByUserId);

// oder
// router.get("/:pid", placesControllers.getPlaceById);
// router.get("/user/:uid", placesControllers.getPlaceByUserId);

router.post("/", createPlace);
router.patch("/:pid", updatePlace);
router.delete("/:pid", deletePlace);
module.exports = router;
