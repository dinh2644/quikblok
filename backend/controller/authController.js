const { hashPassword, comparePassword } = require("../helpers/auth");

const test = (req, res) => {
  res.json("test is working");
};

{
  /*USER HANDLING*/
}
const UserModel = require("../models/Users");
// Register endpoint
const registerUser = async (req, res) => {
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

    return res.json(user);
  } catch (error) {
    console.error(error);
  }
};

// Login endpoint
const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;
    // Check if user exists
    const usernameMatch = await UserModel.findOne({ username });
    if (!usernameMatch) {
      return res.json({
        error: "No user found!",
      });
    }
    // Check if passwords match
    const passwordMatch = await comparePassword(
      password,
      usernameMatch.password
    );
    if (passwordMatch) {
      res.json("Password matches!");
    } else {
      return res.json({ error: "Incorrect password!" });
    }
  } catch (error) {
    console.error(error);
  }
};

{
  /*BLOCK HANDLING*/
}
const Block = require("../models/Blocks");
// Retrieve block endpoint
const getBlock = async (req, res) => {
  try {
    const result = await Block.find({}).exec();
    return res.json(result);
  } catch (err) {
    return res.json(err);
  }
};
// Create block endpoint
const createBlock = async (req, res) => {
  const block = req.body;
  const NewBlock = new Block(block);
  await NewBlock.save();
  return res.json(block);
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
  test,
  registerUser,
  loginUser,
  getBlock,
  createBlock,
  deleteBlock,
};
