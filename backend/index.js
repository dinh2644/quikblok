const express = require("express");
require("dotenv").config();
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const app = express();
const PORT = 8000;

// CORS configuration
const corsOptions = {
  origin: process.env.FRONTEND_URL,
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
};
// Apply CORS middleware
app.use(cors(corsOptions));

// Other middleware
app.use(express.json({ limit: "100mb" }));
app.use(cookieParser());
app.use(express.urlencoded({ limit: "100mb", extended: true }));

// Routes
app.use("/", require("./routes/authRoutes"));

// Database connection
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connection Successful!"))
  .catch((err) => console.error("Connection failed", err));

// Start server
app.get("/", (req, res) => res.send("Express on Render"));
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});

module.exports = app;