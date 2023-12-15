const express = require("express");
const router = express.Router();
//const cors = require("cors");
const {
  registerUser,
  loginUser,
  getProfile,
  logoutUser,
  getBlock,
  createBlock,
  deleteBlock,
} = require("../controller/authController");
const { userVerification } = require("../middlewares/AuthMiddleware");

// middleware
//router.use(cors({ credentials: true, origin: "http://localhost:5173" }));
router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/profile", getProfile);
router.post("/logout", logoutUser);
router.post("/", userVerification);

router.get("/getBlock", getBlock);
router.post("/postBlock", createBlock);
router.delete("/deleteBlock/:id", deleteBlock);

module.exports = router;
