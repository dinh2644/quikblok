const express = require("express");
const router = express.Router();
//const cors = require("cors");
const {
  registerUser,
  getUserInfo,
  loginUser,
  updateUser,
  logoutUser,
  getBlock,
  createBlock,
  deleteBlock,
  verifyUser,
  updateEmail,
  newEmailVerification,
} = require("../controller/authController");
const { userVerification } = require("../middlewares/AuthMiddleware");

// post
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.post("/", userVerification, getUserInfo);
router.post("/createBlock", userVerification, createBlock);
router.post("/newEmailVerification", userVerification, newEmailVerification)

// get
router.get("/getBlock", userVerification, getBlock);
router.get("/verify/:token", verifyUser);

// update
router.put("/updateUser", userVerification, updateUser);
router.put("/updateEmail", userVerification, updateEmail);
//router.put("/updateBlockInfo, userVerification, updateBlockInfo")

// delete
router.delete("/deleteBlock/:id", deleteBlock);

module.exports = router;
