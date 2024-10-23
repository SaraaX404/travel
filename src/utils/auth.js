import jwt from 'jsonwebtoken';
import User from '../models/User'; // Mongoose User model
import connectDB from './connectDB'; // Connect to MongoDB

const JWT_SECRET = process.env.JWT_SECRET; // Ensure you set this in your .env file

// Middleware to verify if the user is an admin
export const verifyAdmin = async (req) => {
  try {
    // Extract token from authorization header
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return null; // No token provided
    }

    // Verify the token
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Connect to DB
    await connectDB();

    // Find the user by the decoded user ID
    const user = await User.findById(decoded.id);
    if (!user || user.role !== 'admin') {
      return null; // User is not an admin
    }

    return { id: user._id, email: user.email, role: user.role };
  } catch (error) {
    console.error('JWT Verification Error:', error);
    return null; // Token verification failed
  }
};
