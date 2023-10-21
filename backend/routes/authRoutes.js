const express = require("express");
const router = express.Router();
const cors = require("cors");
const {
  test,
  registerUser,
  loginUser,
  getBlock,
  createBlock,
  deleteBlock,
} = require("../controller/authController");

// middleware
router.use(cors({ credentials: true, origin: "http://localhost:5173" }));

router.get("/", test);

router.post("/register", registerUser);
router.post("/login", loginUser);

router.get("/getBlock", getBlock);
router.post("/postBlock", createBlock);
router.delete("/deleteBlock/:id", deleteBlock);

module.exports = router;
