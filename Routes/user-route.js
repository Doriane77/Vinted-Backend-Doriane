const express = require("express");
const router = express.Router();
const SHA256 = require("crypto-js/sha256");
const encBase64 = require("crypto-js/enc-base64");
const uid2 = require("uid2");

const User = require("../Models/user-model");

const cloudinary = require("cloudinary").v2;
cloudinary.config({
  cloud_name: "kimeva",
  api_key: "239947553397816",
  api_secret: "7lp7tHJEvZQnt4BQ1xfDCtm2C1Y",
});

/*
Model User:
email: {
  unique: true,
  type: String,
  },
  account: {
    username: { required: true, type: String,},
    phone: String,
    avatar: Object,
  },
  token: String,
  hash: String,
  salt: String,
*/

// Voir tous les utilisateurs
router.get("/Users", async (req, res) => {
  try {
    const user = await User.find();
    return res.status(200).json(user);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

// Se connecter mot de passe: azerty ou jikook
router.post("/User-login", async (req, res) => {
  try {
    const { email, password } = req.fields;
    const user = await User.findOne({ email: email });
    const hash = SHA256(password + user.salt).toString(encBase64);

    if (email && password) {
      if (user) {
        console.log("user", user);
        if (user.hash === hash) {
          console.log("Mot de passe correcte");
          return res.status(200).json({
            _id: user._id,
            token: user.token,
            account: user.account,
          });
        } else {
          return res
            .status(401)
            .json({ message: "Email or Password incorrect" });
        }
      }
      console.log(user);
    } else {
      return res.status(401).json({ message: "Missing fields" });
    }
  } catch (error) {
    return res.status(404).json({ error: error.message });
  }
});

// Creer un compte
router.post("/User-signUp", async (req, res) => {
  try {
    const { email, username, password, phone, avatar } = req.fields;

    const user = await User.findOne({ email: email });
    if (user) {
      return res
        .status(401)
        .json({ message: "Email or username already exists" });
    } else {
      if (email && username && password) {
        const salt = uid2(16);
        const hash = SHA256(password + salt).toString(encBase64);
        const token = uid2(16);
        const result = await cloudinary.uploader.upload(req.files.avatar.path);

        const user = new User({
          email: email,
          account: {
            username: username,
            phone: phone,
            avatar: result.url,
          },
          token: token,
          hash: hash,
          salt: salt,
        });

        await user.save();
        return res.status(200).json({
          email: email,
          account: {
            username: username,
            phone: phone,
            avatar: avatar,
          },
        });
      } else {
        return res.status(401).json({ message: "Missing fields" });
      }
    }
  } catch (error) {
    return res.status(404).json({ error: error.message });
  }
});

module.exports = router;
