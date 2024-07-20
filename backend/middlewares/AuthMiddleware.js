const User = require("../models/Users");
require("dotenv").config();
const jwt = require("jsonwebtoken");

module.exports.userVerification = async (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.json({ status: false });

  }
  jwt.verify(token, process.env.JWT_SECRET, async (err, data) => {
    if (err) {
      return res.status(401).json({ error: 'Request is not authorized' });
    } else {
      const user = await User.findById(data.id);
      if (!user) {
        return res.status(401).json({ error: 'User not found' });
      }
     
      req.user = user;
      next();
    }
  });
};
