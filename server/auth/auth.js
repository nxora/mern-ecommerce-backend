const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto")
const sendMail = require("./sendMail")
const { OAuth2Client } = require("google-auth-library")
const client = new OAuth2Client(process.env.CLIENT_ID)

async function register(req, res) {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }
        const existing = await User.findOne({ email });
        if (existing) {
            return res.status(400).json({ message: "Email already registered" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashed = await bcrypt.hash(password, salt);
        const verificationToken = crypto.randomBytes(32).toString("hex")

        const user = await User.create({ name, email, password: hashed, verificationToken, verified: false });
        const verifyLink = `${process.env.CLIENT_URL}/verify/${verificationToken}`; 
        await sendMail(email, "Verify your account", `Click to verify your account: ${verifyLink}`);

            
        return res.status(201).json({ message: "User registered. Pls check your email to verify your account" });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
}


async function login(req, res) {
    try {
        const { email, password } = req.body
        if (!email || !password) {
            return res.status(400).json({ message: "All fields required" })
        }

        const existing = await User.findOne({ email });
        if (!existing) {
            return res.status(400).json({ message: "Email not registered" });
        }
        if (!existing.verified) {
           return res.status(400).json({ message: "Please verify your email first" });    
        }
        const isMatch = await bcrypt.compare(password, existing.password)
        if (!isMatch) {
            return res.status(400).json({ message: "Wrong password" });
        }
        const token = jwt.sign(
            { id: existing._id },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.status(201).json({
            message: "User login successful",
            token,
            user: {
                id: existing._id,
                name: existing.name,
                email: existing.email
            }
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
}

function authMiddleware(req, res, next) {
    const authHeader = req.headers.authorization

    if (!authHeader) {
        return res.status(401).json({ message: "No token provided" })
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        req.user = decoded
        next()
    } catch (err) {
        return res.status(401).json({ message: "Invalid token" })
    }
}

async function verifyEmail(req, res) {
    try {
        const { token } = req.params; 

        const user = await User.findOne({ verificationToken: token });
        if (!user) {
            return res.status(400).json({ message: "Invalid verification token" });
        }

        user.verified = true;
        user.verificationToken = null;
        await user.save();

        const veritoken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

        res.json({ message: "Email verified successfully!", token: veritoken, user: {id: user._id, name: user.name, email: user.email}  });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error", veritoken });
    }
}

async function googleAuth(req, res){
    try {
        const { credential, redirect } = req.body
        const ticket = await client.verifyIdToken({
            idToken: credential,
            audience: process.env.CLIENT_ID
        })

        const payload = ticket.getPayload()
        const { email, name, sub } = payload

        let user = await User.findOne({ email })

        if (!user){
            user = await User.create({name, email, googleId: sub, verified: true})
        }

         const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.json({ message: "Google login successful", token, user: {id:user.id, name: user.name, email: user.email}, redirect: redirect || "/"})
    } catch (err) {
       console.error(err);
       res.status(500).json({ message: "Google Auth failed" })
        
    }
}

module.exports = { register, login, authMiddleware, verifyEmail, googleAuth };