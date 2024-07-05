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
  try {
    const decryptedPassword = decrypt(req.body);
    return res.json(decryptedPassword);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to decrypt password." });
  }
};

const validatePassword = (password) => {
  // From: https://stackoverflow.com/questions/70140205/passwordincluding-numerics-alphabets-8-words-at-least
  const passwordRegex = /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{6,})/;
  return passwordRegex.test(password);
};
const validateEmail = (email) => {
  // From: https://www.regular-expressions.info/
  const emailRegex = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/;
  return emailRegex.test(email);
};

// Register endpoint
const registerUser = async (req, res) => {
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
    // Check for email validation
    if(!validateEmail(email)){
      return res.json({
        error: "Email must be in the format 'example@example.com'."
      })
    }
    // Check if username is taken
    const userNameExist = await User.findOne({ username });
    if (userNameExist) {
      return res.json({
        error: "Username is taken already!",
      });
    }
    // Check for password strength
    if (!validatePassword(password)) {
      return res.json({
        error: "Password must be at least 6 characters long, including 1 uppercase letter, 1 lowercase letter, and 1 digit.",
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
    const link = `${process.env.FRONTEND_URL}/preverify/${token.token}`;
    await sendEmail(email, link);

    res.status(201).json({
      message: "A verification link has been sent to your email.",
      success: true,
      user,
    });


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
   
    if (!token) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    await User.updateOne({ _id: token.userId }, { $set: { verified: true } });
    
    res
      .status(201)
      .json({ message: "Email Verified" });

      setTimeout(async () => {
        await Token.findOneAndDelete({ _id: token._id });
      }, 1000); 
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
      return res.json({
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
      const link = `${process.env.FRONTEND_URL}/preverify/${token.token}`;
      await sendEmail(user.email, link);
      
      // res.status(400) prevents users from logging in
      return res.json({
        error: "Email not verified. A verification link has been resent.",
      });    
    }

    // check if passwords match
    const passwordMatch = await comparePassword(password, user.password);
    if (!passwordMatch) {
      return res.json({ error: "Incorrect password or username" });
    }

    // create token after successfully logging in
    const token = createSecretToken(user._id);
    res.cookie("token", token, {
      withCredentials: true,
      secure: true, // for https
      sameSite: 'None',
      path: "/"
    }).send();

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

// Delete account
const deleteAccount = async (req,res) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { password: inputtedPassword } = req.body;

    const passwordMatch = await comparePassword(
      inputtedPassword.trim(),
      req.user.password.trim()
    );
    
    if (!passwordMatch) {
      return res.json({
        error: "Current password is not correct.",
      });
    }
   
    const [deletedAccount, deletedBlocks] = await Promise.all([
      User.findByIdAndDelete(req.user._id).exec(),
      Block.deleteMany({ postedBy: req.user._id }).exec()
    ]);

    if (!deletedAccount) {
      return res.json({ message: "Account not found" });
    }

    res.json({ message: "Account and associated blocks deleted successfully" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error });
  }
}

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
    const link = `${process.env.FRONTEND_URL}/preverify/${token.token}`;
    await sendEmail(email, link);

    res.status(201).json({
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

    // creates copy of all data sent from frontend
    const updateData = { ...req.body };

    // if password is being updated
    if (updateData.password) {
      const currentBlock = await Block.findById(blockId);
      const decryptedStoredPassword = decrypt(currentBlock);
      // if changed password is different from current one, encrypt and
      // update the new password
      if (updateData.password !== decryptedStoredPassword) {
        const encryptedPassword = encrypt(updateData.password);
        updateData.password = encryptedPassword.password;
        updateData.iv = encryptedPassword.iv;
      } else {
        // if updated password is unchanged, delete from update payload 
        // to prevent unnecessary updates
        delete updateData.password;
        delete updateData.iv;
      }
    }
    
    const updatedBlockInfo = await Block.findByIdAndUpdate(blockId, updateData, {
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
    if (!req.user || !req.user._id) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const deletedBlock = await Block.findByIdAndDelete(blockId).exec();
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

// Get number of blocks a user has
const getNoOfBlocks = async(req,res) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const count = await Block.countDocuments({postedBy: req.user._id});
    res.json({ count });


  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error });
  }
}

module.exports = {
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
};
