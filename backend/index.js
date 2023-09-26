const express = require('express');
const cors = require("cors");
const mongoose = require('mongoose'); 
const app = express();

const PORT = process.env.PORT || 5050;

app.listen(PORT, ()=>{
  console.log(`Server is runnig at PORT: ${PORT}`)
})