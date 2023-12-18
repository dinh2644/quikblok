const { hashPassword, comparePassword } = require("../helpers/auth");
const { createSecretToken } = require("../util/SecretToken");
const jwt = require("jsonwebtoken");
const Block = require("../models/Blocks");
const UserModel = require("../models/Users");


const getFirstName = async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const firstName = req.user.firstName;

    if (firstName) {
      return res.json({ user: firstName });
    } else {
      return res.json({ message: "First name not found for the user" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch first name' });
  }
};

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
    console.error(err);
    res.status(500).json({ message: 'Failed to sign up'});
  }
};

// Login 
const loginUser = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    // Check if user exists
    const user = await UserModel.findOne({ username });
    if (!user) {
      return res.status(404).json({
        error: "No user found!",
      });
    }
    // Check if passwords match
    const passwordMatch = await comparePassword(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: "Incorrect password or username" });
    }
    const token = createSecretToken(user._id);
    res.cookie("token", token, {
      withCredentials: true,
      httpOnly: false,
    });
    res.status(201).json({ 
      message: "User logged in successfully", 
      success: true,
      token: token // for postman
    });
    next(); 
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to log in" });
  }
};

// Logout user
const logoutUser = async (req, res) => {
  res.clearCookie("token");
  res.json({ message: "Logout successful" });
};

// Get user's block 
const getBlock = async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const userId = req.user._id;

    const myBlocks = await Block.find({ postedBy: userId }) 
      .populate("postedBy", "_id name"); 

    res.json({ myBlocks });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to log out'});
  }
};

// Create block
const createBlock = async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { blockName, name, email, username, password, picture, securityQuestions } = req.body;

    const newBlock = await Block.create({
      postedBy: req.user._id,
      blockName,
      name,
      email,
      username,
      password,
      picture,
      securityQuestions,
    });

    res.status(201).json({ message: 'Block created successfully', block: newBlock });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to create block'});
  }
};

// Delete block
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
    console.error(err);
    res.status(500).json({ message: 'Failed to delete block'});
  }
};


module.exports = {
  registerUser,
  getFirstName,
  loginUser,
  logoutUser,
  getBlock,
  createBlock,
  deleteBlock,
};
