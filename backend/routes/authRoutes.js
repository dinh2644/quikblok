const express = require("express");
const router = express.Router();
const cors = require("cors");
const {
  registerUser,
  getUserInfo,
  loginUser,
  updatePersonalInfo,
  logoutUser,
  deleteAccount,
  getBlock,
  createBlock,
  updateBlock,
  deleteBlock,
  getNoOfBlocks,
  verifyUser,
  updateEmail,
  newEmailVerification,
  updatePassword,
  forgotPassword,
  resetPassword,
  decryptPassword,
} = require("../controller/authController");
const { userVerification } = require("../middlewares/AuthMiddleware");
router.use(
  cors({
    origin: [`${process.env.FRONTEND_URL}`],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

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
router.get("/getNoOfBlocks", userVerification, getNoOfBlocks);

// update
router.put("/updatePersonalInfo", userVerification, updatePersonalInfo);
router.put("/updateEmail", userVerification, updateEmail);
router.put("/updatePassword", userVerification, updatePassword);
router.put("/updateBlock/:id", userVerification, updateBlock);

// delete
router.delete("/deleteBlock/:id", userVerification, deleteBlock);
router.delete("/deleteAccount",userVerification, deleteAccount);

module.exports = router;
