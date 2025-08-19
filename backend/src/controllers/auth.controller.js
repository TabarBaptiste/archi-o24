const db = require('../models');
const User = db.user;
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// User registration
exports.register = async (req, res) => {
  try {
    // Validate request
    if (!req.body.name || !req.body.email || !req.body.password) {
      return res.status(400).json({ message: "Name, email, and password are required fields" });
    }
    
    // Check if user already exists
    const existingUser = await User.findOne({ where: { email: req.body.email } });
    if (existingUser) {
      return res.status(400).json({ message: "Email already in use" });
    }
    
    // Hash the password
    const hashedPassword = bcrypt.hashSync(req.body.password, 8);
    
    // Create new user
    const user = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword
    });
    
    // Generate JWT token
    const token = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET || 'cours-angular',
      { expiresIn: 86400 } // 24 hours
    );
    
    // Return user information and token
    res.status(201).json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      },
      token: token
    });
  } catch (error) {
    res.status(500).json({ message: error.message || "Error occurred while registering the user" });
  }
};

// User login
exports.login = async (req, res) => {
  try {
    // Validate request
    if (!req.body.email || !req.body.password) {
      return res.status(400).json({ message: "Email and password are required fields" });
    }
    
    // Find user by email
    const user = await User.findOne({ where: { email: req.body.email } });
    
    // Check if user exists
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    // Validate password
    const isPasswordValid = bcrypt.compareSync(req.body.password, user.password);
    
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid password" });
    }
    
    // Generate JWT token
    const token = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET || 'cours-angular',
      { expiresIn: 86400 } // 24 hours
    );
    
    // Return user information and token
    res.status(200).json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      },
      token: token
    });
  } catch (error) {
    res.status(500).json({ message: error.message || "Error occurred while logging in" });
  }
};
