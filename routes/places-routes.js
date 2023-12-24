const express = require("express");
const router = express.Router();

const DUMMY_PLACES = [
  {
    id: "p1",
    title: "Empire State Building",
    description: "one of the most famous sky scrapers in the World!",
    location: {
      lat: 40.7484405,
      lng: -73.9856644,
    },
    address: "20 W 34th St., New York, NY 10001, United States",
    creator: "u1",
  },
];

// /api/places/p1
router.get("/:pid", (req, res, next) => {
  const placeId = req.params.pid; // { pid: 'p1' }
  // console.log("GET Request in Places!");
  const place = DUMMY_PLACES.find((p) => placeId === p.id);
  // res.json({ message: "It works!" }).status(200);
  // res.json({ place: place }).status(200);
  res.json({ place }).status(200); // => {place} => {place:place}
});

module.exports = router;
