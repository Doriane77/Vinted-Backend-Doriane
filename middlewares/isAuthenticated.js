const User = require("../Models/user-model");

const isAuthenticated = async (req, res, next) => {
  if (req.headers.authorization) {
    const token = req.headers.authorization.replace("Bearer ", "");
    const user = await User.findOne({
      token: token,
    }).select("account _id");

    // console.log("isAuthenticated");

    if (user) {
      //   console.log(user);
      req.user = user;
      return next();
    } else {
      return res.status(401).json({ error: "Unauthorized" });
    }
  } else {
    return res.status(401).json({ error: "Unauthorized" });
  }
};
module.exports = isAuthenticated;
