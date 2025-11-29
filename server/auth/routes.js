const express = require('express')
const router = express.Router()

const { register, login, authMiddleware, verifyEmail, googleAuth} = require("./auth")
const User = require("../models/User")

router.post("/register", register);
router.post("/login", login)
router.get("/verify/:token", verifyEmail)
router.post("/google", googleAuth)
 
router.get("/profile", authMiddleware, (req, res) => {
    res.json({ message: "Protected route", user: req.user })
})

 
router.get("/me", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password")
    if(!user){
      return res.status(404).json({message: "User not found "})
    }
    res.json(user)
  } catch (err) {
    res.status(500).json({ message: "Server error" })
  }
})
module.exports = router