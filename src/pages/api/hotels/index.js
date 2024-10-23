import Hotel from '../../../models/Hotel'; // Mongoose model for Hotel
import connectDB from '../../../utils/connectDB'; // Database connection
import { verifyAdmin } from '../../../utils/auth'; // JWT admin verification

connectDB(); // Ensure database is connected

export default async function handler(req, res) {
  switch (req.method) {
    case 'GET':
      await handleGetHotels(req, res);
      break;
    case 'POST':
      await handleCreateHotel(req, res);
      break;
    default:
      res.status(405).json({ message: 'Method not allowed' });
      break;
  }
}

// Handle GET request to fetch all hotels
const handleGetHotels = async (req, res) => {
  try {
    const hotels = await Hotel.find(); // Fetch all hotels from the database
    res.status(200).json(hotels);
  } catch (error) {
    console.error('Error fetching hotels:', error);
    res.status(500).json({ message: 'Server error', error });
  }
};

// Handle POST request to create a new hotel (admin only)
const handleCreateHotel = async (req, res) => {
  try {
    // Verify if the user is an admin
    const admin = await verifyAdmin(req);
    if (!admin) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const { name, description, location, rating } = req.body;

    // Validate required fields
    if (!name || !description || !location || !rating) {
      return res.status(400).json({ message: 'Please provide name, description, location, and rating' });
    }

    // Create a new hotel
    const newHotel = new Hotel({
      name,
      description,
      location,
      rating,
      createdBy: admin.id, // Store the admin's user ID
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
};
