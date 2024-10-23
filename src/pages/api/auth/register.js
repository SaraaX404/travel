import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../../../models/User'; // Mongoose User model
import connectDB from '../../../utils/connectDB'; // Database connection

connectDB(); // Ensure database is connected

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { username, email, password } = req.body;

  try {
    // Check if the user already exists with the provided email
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    // Hash the password before saving to the database
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new user
    const newUser = new User({
      username,
      email,
      password: hashedPassword, // Store hashed password
    });

    // Save the user to the database
    const savedUser = await newUser.save();

    // Create a JWT token for the new user
    const token = jwt.sign(
      { id: savedUser._id, role: savedUser.role }, // Payload (user ID and role)
      process.env.JWT_SECRET, // Secret key from environment variables
      { expiresIn: '1h' } // Token expiration
    );

    // Return success response with the token and user details
    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: savedUser._id,
        username: savedUser.username,
        email: savedUser.email,
        role: savedUser.role,
      },
    });
  } catch (error) {
    // Catch any server errors and return a 500 status
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error', error });
  }
}
