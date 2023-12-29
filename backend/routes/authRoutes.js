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
  deleteBlock,
  verifyUser,
  updateEmail,
  newEmailVerification,
  updatePassword
} = require("../controller/authController");
const { userVerification } = require("../middlewares/AuthMiddleware");

// post
router.post("/", userVerification, getUserInfo);
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.post("/createBlock", userVerification, createBlock);
router.post("/newEmailVerification", userVerification, newEmailVerification)

// get
router.get("/getBlock", userVerification, getBlock);
router.get("/verify/:token", verifyUser);

// update
router.put("/updatePersonalInfo", userVerification, updatePersonalInfo);
router.put("/updateEmail", userVerification, updateEmail);
router.put("/updatePassword", userVerification, updatePassword);

//router.put("/updateBlockInfo, userVerification, updateBlockInfo")

// delete
router.delete("/deleteBlock/:id", deleteBlock);

module.exports = router;
