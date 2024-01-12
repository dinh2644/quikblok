const { hashPassword, comparePassword } = require("../helpers/auth");
const { encrypt, decrypt } = require("../helpers/EncryptionHandler");
const { createSecretToken } = require("../util/SecretToken");
const { sendEmail } = require("../util/SendEmail");
const { sendResetPasswordLink } = require("../util/SendResetPasswordLink");
const Block = require("../models/Blocks");
const User = require("../models/Users");
const Token = require("../models/Token");
const crypto = require("crypto");

// retrieve relative information for fetching in frontend
const getUserInfo = async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const userInfo = req.user;

    if (userInfo) {
      return res.json({ userInfo: userInfo });
    } else {
      return res.json({ message: "User is not found." });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error });
  }
};

const decryptPassword = (req, res) => {
  res.send(decrypt(req.body));
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
      message: "A verification link has been sent to your email.",
      success: true,
      user,
    });

    next();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error });
  }
};

// Verify user when user clicks link
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
    const user = await User.findOne({ username });

    // check if user exists
    if (!user) {
      return res.status(404).json({
        error: "No user found!",
      });
    }
    // resend verification email if user is not verified
    if (!user.verified) {
      let token = await Token.findOne({ userId: user._id });
      if (!token) {
        token = await new Token({
          userId: user._id,
          token: crypto.randomBytes(16).toString("hex"),
        }).save();
      }
      // send mail
      const link = `${process.env.BASE_URL}/verify/${token.token}`;
      await sendEmail(user.email, link);

      return res.status(400).send({
        message: "A verification link has been resent to your email.",
      });
    }

    // check if passwords match
    const passwordMatch = await comparePassword(password, user.password);
    if (!passwordMatch) {
      return res
        .status(401)
        .json({ message: "Incorrect password or username" });
    }

    // create token after successfully logging in
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
const updatePersonalInfo = async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const updatedPseronalInfo = await User.findByIdAndUpdate(
      req.user._id,
      req.body,
      {
        new: true,
      }
    );

    res.status(200).json(updatedPseronalInfo);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error });
  }
};

// Update user's email
const updateEmail = async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // unverify user
    await User.findByIdAndUpdate(req.user._id, { $set: { verified: false } });

    // update to new email
    const updatedEmail = await User.findByIdAndUpdate(req.user._id, req.body, {
      new: true,
    });
    res.status(200).json(updatedEmail);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error });
  }
};

// Send new verification email
const newEmailVerification = async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { email } = req.body;

    // create new verification token
    const token = await new Token({
      userId: req.user._id,
      token: crypto.randomBytes(16).toString("hex"),
    }).save();

    // send mail
    const link = `${process.env.BASE_URL}/verify/${token.token}`;
    await sendEmail(email, link);

    res.status(200).json({
      message: "A new verification link has been sent to your email.",
      success: true,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error });
  }
};

// Update user's password
const updatePassword = async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { password: newPassword, oldPassword } = req.body;

    const passwordMatch = await comparePassword(
      newPassword.trim(),
      req.user.password.trim()
    );
    const oldPasswordMatch = await comparePassword(
      oldPassword.trim(),
      req.user.password.trim()
    );

    if (passwordMatch) {
      return res.json({
        error: "New password cannot match with current password.",
      });
    }
    if (!oldPasswordMatch) {
      return res.json({
        error: "Old password does not match with current password.",
      });
    }

    // hash new password
    const hashedPassword = await hashPassword(newPassword);

    const updatedPassword = await User.findByIdAndUpdate(
      req.user._id,
      { password: hashedPassword },
      {
        new: true,
      }
    );

    res.status(200).json(updatedPassword);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error });
  }
};

// Reset password
const forgotPassword = async (req, res) => {
  const { email } = req.body;

  if (!email) return res.status(400).json({ error: "Please enter your email" });

  const user = await User.findOne({ email: email });

  if (!user) {
    return res.json({ error: "Email not found." });
  }
  const resetToken = user.getResetPasswordToken();
  await user.save();

  const link = `http://localhost:5173/resetPassword/${resetToken}`;
  await sendResetPasswordLink(email, link);

  res
    .status(200)
    .json({ message: "Reset password link sent successfully to your email." });
};

// Reset password
const resetPassword = async (req, res) => {
  try {
    const { password, resetToken } = req.body;

    if (!resetToken || !password)
      return res.status(400).json({ error: "Invalid Request" });

    const resetPasswordToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user)
      return res.status(400).json({ error: "Invalid Token or expired" });

    const hashedPassword = await hashPassword(password);

    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    res.status(200).json({ message: "Password has been reset" });
  } catch (error) {
    res.status(500).json({ error: error.message });
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

    const encryptedPassword = encrypt(password);

    const newBlock = await Block.create({
      postedBy: req.user._id,
      blockName,
      name,
      email,
      username,
      password: encryptedPassword.password,
      picture,
      securityQuestions,
      iv: encryptedPassword.iv,
    });

    res
      .status(201)
      .json({ message: "Block created successfully", block: newBlock });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error });
  }
};

// Update block
const updateBlock = async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const blockId = req.params.id;

    const updatedBlockInfo = await Block.findByIdAndUpdate(blockId, req.body, {
      new: true,
    });

    res.status(200).json(updatedBlockInfo);
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
};
