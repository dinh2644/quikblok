const express = require("express");
const router = express.Router();
//const cors = require("cors");
const {
  registerUser,
  getUserInfo,
  loginUser,
  updatePersonalInfo,
  logoutUser,
  getBlock,
  createBlock,
  updateBlock,
  deleteBlock,
  verifyUser,
  updateEmail,
  newEmailVerification,
  updatePassword,
  forgotPassword,
  resetPassword,
  decryptPassword,
} = require("../controller/authController");
const { userVerification } = require("../middlewares/AuthMiddleware");

// post
router.post("/", userVerification, getUserInfo);
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.post("/newEmailVerification", userVerification, newEmailVerification);
router.post("/forgotPassword", forgotPassword);
router.post("/resetPassword", resetPassword);
router.post("/createBlock", userVerification, createBlock);
router.post("/decryptPassword", decryptPassword);

// get
router.get("/getBlock", userVerification, getBlock);
router.get("/verify/:token", verifyUser);

// update
router.put("/updatePersonalInfo", userVerification, updatePersonalInfo);
router.put("/updateEmail", userVerification, updateEmail);
router.put("/updatePassword", userVerification, updatePassword);
router.put("/updateBlock/:id", userVerification, updateBlock);

// delete
router.delete("/deleteBlock/:id", deleteBlock);

module.exports = router;
