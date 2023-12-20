const express = require("express");
const router = express.Router();
//const cors = require("cors");
const {
  registerUser,
  getFirstName,
  loginUser,
  logoutUser,
  getBlock,
  createBlock,
  deleteBlock,
} = require("../controller/authController");
const { userVerification } = require("../middlewares/AuthMiddleware");

// post
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.post("/", userVerification, getFirstName);
router.post("/createBlock", userVerification, createBlock);

// get
router.get("/getBlock", userVerification, getBlock);

// update
//router.put("/updateAccountInfo, userVerification, updateAccountInfo") 
//router.put("/updateBlockInfo, userVerification, updateBlockInfo") 

// delete
router.delete("/deleteBlock/:id", deleteBlock);

module.exports = router;
