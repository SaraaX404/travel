import Hotel from '../../../models/Hotel'; // Mongoose model for Hotel
import connectDB from '../../../utils/connectDB'; // Database connection
import { verifyAdmin } from '../../../utils/auth'; // JWT admin verification

connectDB(); // Ensure database is connected

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Verify if the user is an admin
    const admin = await verifyAdmin(req);
    if (!admin) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const { name, description, location, rating } = req.body;

    // Validate required fields
    if (!name || !description || !location || rating === undefined) {
      return res.status(400).json({ message: 'Please provide name, description, location, and rating' });
    }

    // Create a new hotel
    const newHotel = new Hotel({
      name,
      description,
      location,
      rating,
      createdBy: admin.id, // Store the admin's user ID who created the hotel
    });

    // Save the hotel to the database
    await newHotel.save();

    // Return the created hotel
    res.status(201).json({
      message: 'Hotel created successfully',
      hotel: newHotel,
    });
  } catch (error) {
    console.error('Error creating hotel:', error);
    res.status(500).json({ message: 'Server error', error });
  }
}
