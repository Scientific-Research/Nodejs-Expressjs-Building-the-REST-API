const fs = require("fs");
const path = require("path");
const config = require("./config.js");
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

// middleware for images: http://localhost:5000/uploads/images => we have to have this
// middleware for images here!
app.use("/uploads/images", express.static(path.join("uploads", "images"))); // join these two parts together

// a solution for CORS Problem in Browser
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, DELETE, OPTIONS"
  );
  next();
});

app.use("/api/places", placesRoutes); // => /api/places/...
app.use("/api/users", usersRoutes); // => /api/users/...

app.use((req, res, next) => {
  const error = new HttpError("Could not find this route.", 404);
  // return next(error);
  throw error;
});

app.use((error, req, res, next) => {
  if (req.file) {
    // unlink deletes the file from data storage, therefore, we don't see image in images folder!
    fs.unlink(req.file.path, (err) => {
      console.log(err);
    });
  }
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
      // "mongodb+srv://Maximilian:4N22oIntIDURyhVl@cluster0.ki7w2ay.mongodb.net/MERN-STACK?retryWrites=true&w=majority"
      `mongodb+srv://${config.DB_USER}:${config.DB_PASSWORD}@cluster0.ki7w2ay.mongodb.net/${config.DB_NAME}?retryWrites=true&w=majority`
      // { useNewUrlParser: true, useUnifiedTopology: true }
    );
    // console.log("Connected to database!");
    app.listen(config.PORT, () => {
      console.log(`Server started on PORT ${config.PORT} successfully!`);
      // console.log("Connected to Database successfully!");
    });
  } catch (error) {
    console.log("Connection faild!", error);
  }
};

connectDB();
