import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../../../models/User'; // Mongoose User model
import connectDB from '../../../utils/connectDB'; // Database connection

connectDB(); // Ensure database is connected

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { email, password } = req.body;

  try {
    // Check if user exists with the provided email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Compare provided password with stored hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Create a JWT token
    const token = jwt.sign(
      { id: user._id, role: user.role }, // Payload (user ID and role)
      process.env.JWT_SECRET, // Secret key from environment variables
      { expiresIn: '1h' } // Token expiration (optional)
    );

    // Respond with the token and user details
    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    // Catch any server errors and return a 500 status
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error', error });
  }
}
