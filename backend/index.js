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
    origin: `${process.env.FRONTEND_URL}`,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use(express.json({ limit: "100mb" }));

app.use(cookieParser());
app.use(express.urlencoded({ limit: "100mb", extended: true }));

app.use("/", require("./routes/authRoutes"));
