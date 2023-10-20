const express = require("express");
const dotenv = require('dotenv').config()
const cors = require("cors");
const mongoose = require("mongoose"); 
const multer = require("multer");
const app = express();

const UserModel = require("./models/Users");
const Block = require("./models/Blocks");
//const RecycleBinItem = require("./models/Recyclebin")

// middleware
app.use(express.json());
//app.use(cors());

// database string
mongoose.connect(process.env.MONGO_URL).then(()=>console.log("Connection Successful!!!")).catch((err)=>console.error("Connection failed",err));


app.use('/', require('./routes/authRoutes'))

const port = 8000;
app.listen(port,()=>console.log(`Server is runnning on port ${port}`));

//retrieve blocks
app.get("/getBlock", async (req, res) => {
  try {
    const result = await Block.find({}).exec();
    res.json(result);
  } catch (err) {
    res.json(err);
  }
});

//create blocks
app.post("/postBlock",async(req,res) =>{
  const block = req.body;
  const NewBlock = new Block(block);
  await NewBlock.save();
  res.json(block);
})
//delete blocks
app.delete("/deleteBlock/:id",(req,res)=>{
  const blockId = req.params.id;
  try{
    const deletedBlock = Block.findByIdAndDelete(blockId).exec()
    if(!deletedBlock){
      res.status(404).json({message: "Block not found"})
    }else{
      res.json({message: "Block deleted successfully"})
    }
  }catch(err){
    console.error("Error deleting block:", err);
    res.status(500).json({ message: "Internal server error" });
  }
})

// get users
app.get("/getUsers", async (req, res) => {
  try {
    const result = await UserModel.find({}).exec();
    res.json(result);
  } catch (err) {
    res.json(err);
  }
});

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