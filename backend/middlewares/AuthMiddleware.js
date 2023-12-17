const User = require("../models/Users");
require("dotenv").config();
const jwt = require("jsonwebtoken");

module.exports.userVerification = async(req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    req.user = null;
      return next();
  }

  jwt.verify(token, process.env.JWT_SECRET, async (err, data) => {
    if (err) {
      return res.json({ status: false });
    } else {
      const user = await User.findById(data.id);
      req.user = user; 
      next(); 
    }
  });
};
