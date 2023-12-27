const express = require("express");
// const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const placesRoutes = require("./routes/places-routes");
const usersRoutes = require("./routes/users-routes");
const HttpError = require("./models/http-error");

// Middleware
const app = express();
// app.use(bodyParser.json());
app.use(express.json());

app.use("/api/places", placesRoutes); // => /api/places/...
app.use("/api/users", usersRoutes); // => /api/users/...

app.use((req, res, next) => {
  const error = new HttpError("Could not find this route.", 404);
  // return next(error);
  throw error;
});

app.use((error, req, res, next) => {
  if (res.headerSent) {
    return next(error);
  }
  res.status(error.code || 500);
  res.json({ message: error.message || "An unknown error ocurred!" });
});

const connectDB = async () => {
  try {
    // mongoose.connect() does open, close and all other thing...
    await mongoose.connect(
      "mongodb+srv://Maximilian:4N22oIntIDURyhVl@cluster0.ki7w2ay.mongodb.net/places?retryWrites=true&w=majority"
      // { useNewUrlParser: true, useUnifiedTopology: true }
    );
    // console.log("Connected to database!");
    app.listen(5000, () => {
      console.log("Server started successfully!");
      // console.log("Connected to Database successfully!");
    });
  } catch (error) {
    console.log("Connection faild!", error);
  }
};

connectDB();
