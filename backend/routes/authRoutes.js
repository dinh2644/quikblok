const express = require("express");
const router = express.Router();
//const cors = require("cors");
const {
  registerUser,
  loginUser,
  logoutUser,
  getBlock,
  createBlock,
  deleteBlock,
} = require("../controller/authController");
const { userVerification } = require("../middlewares/AuthMiddleware");

// middleware
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.post("/", userVerification);
router.get("/getBlock", userVerification, getBlock);
router.post("/createBlock", userVerification, createBlock);
router.delete("/deleteBlock/:id", deleteBlock);

module.exports = router;
