const express = require("express");
const dotenv = require("dotenv").config();
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const app = express();
const PORT = 8000;
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});

// database string
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connection Successful!"))
  .catch((err) => console.error("Connection failed", err));

// middleware
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use(express.json({ limit: "100mb" }));

app.use(cookieParser());
app.use(express.urlencoded({ limit: "100mb", extended: true }));

app.use("/", require("./routes/authRoutes"));

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
