import Hotel from '../../../models/Hotel'; // Mongoose model for Hotel
import connectDB from '../../../utils/connectDB'; // Database connection
import { verifyAdmin } from '../../../utils/auth'; // JWT admin verification

connectDB(); // Ensure database is connected

export default async function handler(req, res) {
  const { id } = req.query; // Get the hotel ID from the request query

  switch (req.method) {
    case 'GET':
      await handleGetHotel(req, res, id);
      break;
    case 'PUT':
      await handleUpdateHotel(req, res, id);
      break;
    case 'DELETE':
      await handleDeleteHotel(req, res, id);
      break;
    default:
      res.status(405).json({ message: 'Method not allowed' });
      break;
  }
}

// Handle GET request to fetch a specific hotel by ID
const handleGetHotel = async (req, res, id) => {
  try {
    const hotel = await Hotel.findById(id);
    if (!hotel) {
      return res.status(404).json({ message: 'Hotel not found' });
    }
    res.status(200).json(hotel);
  } catch (error) {
    console.error('Error fetching hotel:', error);
    res.status(500).json({ message: 'Server error', error });
  }
};

// Handle PUT request to update a specific hotel by ID (admin only)
const handleUpdateHotel = async (req, res, id) => {
  try {
    // Verify if the user is an admin
    const admin = await verifyAdmin(req);
    if (!admin) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const { name, description, location, rating } = req.body;

    // Update the hotel details
    const updatedHotel = await Hotel.findByIdAndUpdate(
      id,
      {
        name,
        description,
        location,
        rating,
      },
      { new: true } // Return the updated document
    );

    if (!updatedHotel) {
      return res.status(404).json({ message: 'Hotel not found' });
    }

    res.status(200).json(updatedHotel);
  } catch (error) {
    console.error('Error updating hotel:', error);
    res.status(500).json({ message: 'Server error', error });
  }
};

// Handle DELETE request to delete a specific hotel by ID (admin only)
const handleDeleteHotel = async (req, res, id) => {
  try {
    // Verify if the user is an admin
    const admin = await verifyAdmin(req);
    if (!admin) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Find and delete the hotel
    const deletedHotel = await Hotel.findByIdAndDelete(id);
    if (!deletedHotel) {
      return res.status(404).json({ message: 'Hotel not found' });
    }

    res.status(200).json({ message: 'Hotel deleted successfully' });
  } catch (error) {
    console.error('Error deleting hotel:', error);
    res.status(500).json({ message: 'Server error', error });
  }
};
