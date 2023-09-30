const express = require('express');
const cors = require("cors");
const mongoose = require('mongoose'); 
const app = express();

const UserModel = require("./models/Users");
const Block = require("./models/Blocks");
const RecycleBinItem = require("./models/Recyclebin")

app.use(express.json());
app.use(cors());

//connection string
mongoose.connect("mongodb+srv://dinh2644:8luHY4f1Q1KuFxDz@password-manager.pnahnra.mongodb.net/quikblok?retryWrites=true&w=majority")

app.get("/getBlock", async (req, res) => {
  try {
    const result = await Block.find({}).exec();
    res.json(result);
  } catch (err) {
    res.json(err);
  }
});

app.post("/postBlock",async(req,res) =>{
  const block = req.body;
  const NewBlock = new Block(block);
  await NewBlock.save();

  res.json(block);
})

app.listen(3001, ()=>{
  console.log("Connection successful!");
})