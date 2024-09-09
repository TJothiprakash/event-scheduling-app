const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { sendEmail } = require("../config/Mailer.js"); // Adjust the path as necessary

// Register User
const registerUser = async (req, res) => {
  const { username, email, password, role } = req.body;
  console.log("inside test user function");

  try {
    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log("User already found with email: " + email);
      return res.status(400).json({ msg: "User already exists" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    console.log("Hashed password: " + hashedPassword);

    // Create new user without availability
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      role, // role defaults to 'user'
    });

    console.log("New user created: " + username);

    await newUser.save();
    console.log("New user registered and saved in DB");

    // Prepare email details
    const subject = "Welcome to Our Application";
    const text = "Thank you for registering!";
    const html = "<h1>Welcome!</h1><p>Thank you for registering!</p>";

    // Send welcome email
    try {
      await sendEmail(email, subject, text, html);
      res
        .status(201)
        .json({ message: "User registered successfully and email sent!" });
    } catch (error) {
      console.error("Error sending email:", error);
      res
        .status(201)
        .json({ message: "User registered, but failed to send email." });
    }
  } catch (err) {
    console.error("Error during user registration:", err.message);
    res.status(500).json({ error: err.message });
  }
};

// Login User
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: "Invalid email or password" });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid email or password" });
    }

    // Generate JWT
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    res.json({
      token,
      user: { id: user._id, username: user.username, role: user.role },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Logout User
const logoutUser = (req, res) => {
  res.clearCookie("token"); // If you're using cookies to store the token
  res.status(200).json({ message: "User logged out successfully" });
};

// Use only module.exports
module.exports = {
  registerUser,
  loginUser,
  logoutUser,
};
