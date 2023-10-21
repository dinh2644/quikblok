const express = require("express");
const dotenv = require("dotenv").config();
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const app = express();
//const multer = require("multer");
//const cors = require("cors");

//const UserModel = require("./models/Users");
//const Block = require("./models/Blocks");
//const RecycleBinItem = require("./models/Recyclebin")

// middleware
//app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));

// database string
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("Connection Successful!!!"))
  .catch((err) => console.error("Connection failed", err));

app.use("/", require("./routes/authRoutes"));

const port = 8000;
app.listen(port, () => console.log(`Server is runnning on port ${port}`));

// app.put("/updateBlock/:blockId", async (req, res) => {
//   const blockId = req.params.blockId;
//   const { block } = req.body;

//   try {
//     const updatedBlock = await Block.findByIdAndUpdate(
//       blockId,
//       { block }, // Update the "picture" field with the new base64 data
//       { new: true } // Return the updated block document
//     ).exec();

//     if (!updatedBlock) {
//       return res.status(404).json({ message: "Block not found" });
//     }

//     res.json({ message: "Block picture updated successfully", block: updatedBlock });
//   } catch (err) {
//     console.error("Error updating block picture:", err);
//     res.status(500).json({ message: "Internal server error" });
//   }
// });
