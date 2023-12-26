const { hashPassword, comparePassword } = require("../helpers/auth");
const { createSecretToken } = require("../util/SecretToken");
const { sendEmail } = require("../util/SendEmail");
//const jwt = require("jsonwebtoken");
const Block = require("../models/Blocks");
const User = require("../models/Users");
const Token = require("../models/Token");
const crypto = require("crypto");

// retrieve relative information for fetching in frontend
const getFirstName = async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const firstName = req.user.firstName;
    const id = req.user._id;

    if (firstName) {
      return res.json({ user: firstName, id: id });
    } else {
      return res.json({ message: "First name not found for the user" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error });
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
    const emailExist = await User.findOne({ email });
    if (emailExist) {
      return res.json({ error: "Email is taken already!" });
    }
    // Check if username is taken
    const userNameExist = await User.findOne({ username });
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
    const user = await User.create({
      email,
      firstName,
      lastName,
      username,
      password: hashedPassword,
    });

    const token = await new Token({
      userId: user._id,
      token: crypto.randomBytes(16).toString("hex"),
    }).save();

    // send mail
    const link = `${process.env.BASE_URL}/verify/${token.token}`;
    await sendEmail(email, link);

    res.status(201).json({
      message: "An email has been sent to your account. Please verify.",
      success: true,
      user,
    });

    next();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error });
  }
};

// Verify link
const verifyUser = async (req, res) => {
  try {
    const token = await Token.findOne({
      token: req.params.token,
    });
    console.log(token);
    await User.updateOne({ _id: token.userId }, { $set: { verified: true } });
    await Token.findByIdAndRemove(token._id);
    res.send("Email verified");
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error });
  }
};

// Login
const loginUser = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    // check if user exists
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({
        error: "No user found!",
      });
    }
    // check if passwords match
    const passwordMatch = await comparePassword(password, user.password);
    if (!passwordMatch) {
      return res
        .status(401)
        .json({ message: "Incorrect password or username" });
    }

    // check if user is verified
    // if (!user.verified) {
    //   let token = await Token.findOne({ userId: user._id });
    //   if (!token) {
    //     token = new Token({
    //       userId: user._id,
    //       token: crypto.randomBytes(16).toString("hex"),
    //     }).save();

    //     // send mail
    //     const link = `${process.env.BASE_URL}/${user._id}/verify/${token.token}`;
    //     await sendEmail(email, link);
    //   }

    //   return res.status(400).send({
    //     message: "An email has been sent to your account. Please verify.",
    //   });
    // }

    // create token after logging in
    const token = createSecretToken(user._id);
    res.cookie("token", token, {
      withCredentials: true,
      httpOnly: false,
    });
    res.status(201).json({
      message: "User logged in successfully",
      success: true,
      token: token, // for postman testing
    });
    next();
  } catch (error) {
    console.error(error);
    console.error(error);
    res.status(500).json({ message: error });
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
      return res.status(401).json({ error: "Unauthorized" });
    }

    const userId = req.user._id;

    const myBlocks = await Block.find({ postedBy: userId }).populate(
      "postedBy",
      "_id name"
    );

    res.json({ myBlocks });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error });
  }
};

// Update user info
const updateUser = async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const id = req.params.id;
    const userExist = await User.findById(id);

    if (!userExist) {
      return res.status(401).json({ message: "User not found" });
    }

    const updatedData = await User.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.status(200).json(updatedData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error });
  }
};

// Create block
const createBlock = async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const {
      blockName,
      name,
      email,
      username,
      password,
      picture,
      securityQuestions,
    } = req.body;

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

    res
      .status(201)
      .json({ message: "Block created successfully", block: newBlock });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error });
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
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error });
  }
};

module.exports = {
  registerUser,
  getFirstName,
  loginUser,
  updateUser,
  logoutUser,
  getBlock,
  createBlock,
  deleteBlock,
  verifyUser,
};
