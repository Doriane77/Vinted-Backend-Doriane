require("dotenv").config();
const express = require("express");
const cors = require("cors");
const formidable = require("express-formidable");
const mongoose = require("mongoose");
const cloudinary = require("cloudinary").v2;

app = express();
app.use(cors());
app.use(formidable());

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME_API,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

// Athentifier un utilisateur
const isAuthenticated = require("./middlewares/isAuthenticated");

// User route
const userRoutes = require("./Routes/user-route");
app.use(userRoutes);

// Offer route
const offerRoutes = require("./Routes/offer-route");
app.use(offerRoutes);

app.all("*", (req, res) => {
  res.status(404).send("Page introuvable");
});

app.listen(process.env.PORT, () => {
  console.log("Server started");
});
