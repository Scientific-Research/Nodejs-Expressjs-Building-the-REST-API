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
const checkAuth = require("../middleware/check-auth");

// oder
// const placesControllers = require("../controllers/places-controller");

// /api/places/p1
router.get("/:pid", getPlaceById);
router.get("/user/:uid", getPlacesByUserId);

// oder
// router.get("/:pid", placesControllers.getPlaceById);
// router.get("/user/:uid", placesControllers.getPlaceByUserId);

// this middleware will not interfere with two above router.get, but the
// routes(post,patch,delete) after this middleware have to consider it.
// it means, you can not post, patch or delete, unless you are authenticated!
// they are protected and can be reached only with valid token as wrote in checkAuth.js
// when thre is no success(valid Token), checkAuth will block everything and will send
// an error and will not allow the Program to go further to the post, patch and delete routes.
router.use(checkAuth);

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
