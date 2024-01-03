const { Router } = require("express");
const router = Router();

// const express = require("express");
// const router = express.Router();

const { check } = require("express-validator");

const {
  getPlaceById,
  getPlacesByUserId,
  createPlace,
  updatePlace,
  deletePlace,
} = require("../controllers/places-controller");

const { fileUpload } = require("../middleware/file-upload");

// oder
// const placesControllers = require("../controllers/places-controller");

// /api/places/p1
router.get("/:pid", getPlaceById);
router.get("/user/:uid", getPlacesByUserId);

// oder
// router.get("/:pid", placesControllers.getPlaceById);
// router.get("/user/:uid", placesControllers.getPlaceByUserId);

router.post(
  "/",
  fileUpload.single("image"),
  [
    check("title").not().isEmpty(),
    check("description").isLength({ min: 5 }),
    check("address").not().isEmpty(),
  ],
  createPlace
);

router.patch(
  "/:pid",
  [check("title").not().isEmpty(), check("description").isLength({ min: 5 })],
  updatePlace
);
router.delete("/:pid", deletePlace);
module.exports = router;
