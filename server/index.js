const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const authRoutes = require("./auth/routes")
require("dotenv").config();
require("dotenv").config();
console.log("JWT_SECRET loaded?", !!process.env.JWT_SECRET); 

const app = express();

app.use(cors({
  origin: process.env.CLIENT_URL, credentials: true
}));
app.use(express.json());
app.use("/auth/api", authRoutes)

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

const MenuItem = mongoose.model("MenuItem", new mongoose.Schema({
  name: String,
  description: String,
  price: Number,
  availability: Boolean,
  image_url: String
}), "menu-items");

app.get("/menu", async (req, res) => {
  const items = await MenuItem.find();
  res.json(items);
});

app.get("/menu/:id", async (req, res) =>{
  const item = await MenuItem.findById(req.params.id)
  res.json(item)
  console.log(res);
  
})
app.listen(5000, () => console.log("Server running on port 5000"));