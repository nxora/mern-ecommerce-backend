const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    required: true,
    unique: true,
  },

  password: {
    type: String,
    required: false,
  },

  role: {
    type: String,
    default: "user",
  },

  googleId: { type: String, required: false }, 
  verified: { type: Boolean },
  verificationToken: { type: String }, 
  verficationExpires: { type: Date }
});

module.exports = mongoose.model("User", userSchema);//mhn think im getting the hang of javascript
