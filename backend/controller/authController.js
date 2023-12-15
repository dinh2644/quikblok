const { hashPassword, comparePassword } = require("../helpers/auth");
const { createSecretToken } = require("../util/SecretToken");
const jwt = require("jsonwebtoken");

{
  /*USER HANDLING*/
}
const UserModel = require("../models/Users");
// Register endpoint
const registerUser = async (req, res, next) => {
  try {
    // Check if all fields has input
    const { email, firstName, lastName, username, password } = req.body;
    if (!(email || firstName || lastName || username || password)) {
      return res.json({ error: "All fields are required!" });
    }
    // Check if email is taken
    const emailExist = await UserModel.findOne({ email });
    if (emailExist) {
      return res.json({ error: "Email is taken already!" });
    }
    // Check if username is taken
    const userNameExist = await UserModel.findOne({ username });
    if (userNameExist) {
      return res.json({
        error: "Username is taken already!",
      });
    }
    // Check for password strength
    if (!password || password.length < 6) {
      return res.json({
        error: "Password is required and should be at least 6 characters long!",
      });
    }

    const hashedPassword = await hashPassword(password);
    const user = await UserModel.create({
      email,
      firstName,
      lastName,
      username,
      password: hashedPassword,
    });
    //create token on signup
    const token = createSecretToken(user._id);
    res.cookie("token", token, {
      withCredentials: true,
      httpOnly: false,
    });

    res
      .status(201)
      .json({ message: "User signed in successfully", success: true, user });
    next();
  } catch (error) {
    console.error(error);
  }
};

// Login endpoint
const loginUser = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    // Check if user exists
    const user = await UserModel.findOne({ username });
    if (!user) {
      return res.json({
        error: "No user found!",
      });
    }
    // Check if passwords match
    const passwordMatch = await comparePassword(password, user.password);
    if (!passwordMatch) {
      return res.json({ message: "Incorrect password or email" });
    }
    const token = createSecretToken(user._id);
    res.cookie("token", token, {
      withCredentials: true,
      httpOnly: false,
    });
    res
      .status(201)
      .json({ message: "User logged in successfully", success: true });
    next();
  } catch (error) {
    console.error(error);
  }
};

// Get profile endpoint
const getProfile = async (req, res) => {
  const { token } = req.cookies;
  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, {}, (err, user) => {
      if (err) throw err;
      res.json(user);
    });
  } else {
    res.json(null);
  }
};

// Logout profile endpoint
const logoutUser = async (req, res) => {
  res.clearCookie("token");
  res.json({ message: "Logout successful" });
};

{
  /*BLOCK HANDLING*/
}
const Block = require("../models/Blocks");

// Get user's block endpoint
const getBlock = async (req, res) => {
  Block.find({ userId: req.user._id })
    .populate("UserID", "_id name")
    .then((myBlock) => {
      res.json({ myBlock }).catch((err) => {
        console.error(error);
      });
    });
};

// Create block endpoint
const createBlock = async (req, res) => {
  try {
    const { userId, ...blockData } = req.body; // Extract userId from the request body
    const newBlockData = { userId, ...blockData }; // Combine userId with block data

    const newBlock = new Block(newBlockData);
    await newBlock.save();
    return res.status(201).json(newBlock);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// Delete block endpoint
const deleteBlock = async (req, res) => {
  const blockId = req.params.id;
  try {
    const deletedBlock = Block.findByIdAndDelete(blockId).exec();
    if (!deletedBlock) {
      res.status(404).json({ message: "Block not found" });
    } else {
      res.json({ message: "Block deleted successfully" });
    }
  } catch (err) {
    console.error("Error deleting block:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

{
  /* EXPORT */
}
module.exports = {
  registerUser,
  loginUser,
  getProfile,
  logoutUser,
  getBlock,
  createBlock,
  deleteBlock,
};
