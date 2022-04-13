const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

const User = require("../Models/user-model");
const Offer = require("../Models/offer-model");

const cloudinary = require("cloudinary").v2;

const isAuthenticated = require("../middlewares/isAuthenticated");

/*
Model Offer:
product_name: String,
product_description: String,
product_price: Number,
product_details: Array,
product_image: {
  type: mongoose.Schema.Types.Mixed,
  default: {},
},
owner: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "User",
},
*/

// Récuperer une offre avec son id
router.get("/Offer/:id", async (req, res) => {
  try {
    console.log(req.params);
    const id = req.params.id;
    const offer = await Offer.findById(id).populate({
      path: "owner",
      select: "account",
    });
    return res.status(200).json(offer);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

// Recuperer les offres et permettre de les triées
router.get("/Offers", async (req, res) => {
  try {
    let filters = {};

    if (req.query.title) {
      filters.product_name = new RegExp(req.query.title, "i");
    }
    if (req.query.priceMin) {
      filters.product_price = { $gte: req.query.priceMin };
    }
    if (req.query.priceMax) {
      filters.product_price = {
        $lte: req.query.priceMax,
      };
    }

    let sort = {};
    if (req.query.sort === "price-asc") {
      sort = { product_price: 1 };
    } else if (req.query.sort === "price-desc") {
      sort = { product_price: -1 };
    }

    let page = 1;
    let limit;
    if (Number(req.query.page) > 0) {
      page = Number(req.query.page);
    } else {
      page = 1;
    }
    if (Number(req.query.limit) > 0) {
      limit = Number(req.query.limit);
    } else {
      limit = 10;
    }

    const offers = await Offer.find(filters)
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(limit)
      .populate({
        path: "owner",
        select: "account",
      });

    return res.status(200).json(offers);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

// Modifier une Offre
router.post("/Offer/Update", isAuthenticated, async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      brand,
      size,
      color,
      city,
      condition,
      offerId,
      userId,
    } = req.fields;

    if (userId == req.user._id) {
      //Verrifier que c'est le bon utilisateur

      const offer = await Offer.findById(offerId);

      if (offer) {
        if (
          name ||
          description ||
          price ||
          brand ||
          size ||
          condition ||
          color ||
          city
        ) {
          if (name) {
            offer.product_name = name;
          }
          if (description) {
            offer.product_description = description;
          }
          if (price) {
            offer.product_price = price;
          }
          if (brand) {
            offer.product_details[0] = { MARQUE: brand };
          }
          if (size) {
            offer.product_details[1] = { TAILLE: size };
          }
          if (condition) {
            offer.product_details[2] = { ETAT: condition };
          }
          if (color) {
            offer.product_details[3] = { COULEUR: color };
          }
          if (city) {
            offer.product_details[4] = { EMPLACEMENT: city };
          }
          if (req.files.image.name != "") {
            const result = await cloudinary.uploader.upload(
              req.files.image.path,
              {
                folder: `/Vinted/Offers/${offer._id}`,
              }
            );
            offer.product_image = result;
          }
          await offer.save();
          return res.json(offer);
        } else {
          return res.json("please fill in a field to modify");
        }
      }
    } else {
      return res.status(400).json({ message: "Incorrect user id" });
    }
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

// Creer une offre
router.post("/Publish", isAuthenticated, async (req, res) => {
  try {
    const { name, description, price, brand, size, color, city, condition } =
      req.fields;
    const offer = new Offer({
      product_name: name,
      product_description: description,
      product_price: price,
      product_details: [
        { MARQUE: brand },
        { TAILLE: size },
        { ETAT: condition },
        { COULEUR: color },
        { EMPLACEMENT: city },
      ],
      product_image: {},
      owner: req.user,
    });

    const result = await cloudinary.uploader.upload(req.files.image.path, {
      folder: `/Vinted/Offers/${offer._id}`,
    });

    offer.product_image = result;

    await offer.save();

    return res.status(200).json(offer);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

module.exports = router;
