import Destination from '../../../models/Destination'; // Mongoose model for Destination
import connectDB from '../../../utils/connectDB'; // Database connection
import { verifyAdmin } from '../../../utils/auth'; // JWT admin verification

connectDB(); // Ensure database is connected

export default async function handler(req, res) {
  const { id } = req.query;

  switch (req.method) {
    case 'GET':
      await handleGetDestination(req, res, id);
      break;
    case 'PUT':
      await handleUpdateDestination(req, res, id);
      break;
    case 'DELETE':
      await handleDeleteDestination(req, res, id);
      break;
    default:
      res.status(405).json({ message: 'Method not allowed' });
      break;
  }
}

// Handle GET request to fetch a destination by ID
const handleGetDestination = async (req, res, id) => {
  try {
    const destination = await Destination.findById(id).populate('hotels');
    if (!destination) {
      return res.status(404).json({ message: 'Destination not found' });
    }
    res.status(200).json(destination);
  } catch (error) {
    console.error('Error fetching destination:', error);
    res.status(500).json({ message: 'Server error', error });
  }
};

// Handle PUT request to update a destination by ID (admin only)
const handleUpdateDestination = async (req, res, id) => {
  try {
    // Verify if the user is an admin
    const admin = await verifyAdmin(req);
    if (!admin) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const { name, description, location, image, hotels } = req.body;

    // Find and update the destination
    const updatedDestination = await Destination.findByIdAndUpdate(
      id,
      {
        name,
        description,
        location,
        image, // Image URL
        hotels, // List of hotel IDs
      },
      { new: true } // Return the updated document
    );

    if (!updatedDestination) {
      return res.status(404).json({ message: 'Destination not found' });
    }

    res.status(200).json(updatedDestination);
  } catch (error) {
    console.error('Error updating destination:', error);
    res.status(500).json({ message: 'Server error', error });
  }
};

// Handle DELETE request to delete a destination by ID (admin only)
const handleDeleteDestination = async (req, res, id) => {
  try {
    // Verify if the user is an admin
    const admin = await verifyAdmin(req);
    if (!admin) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Find and delete the destination
    const deletedDestination = await Destination.findByIdAndDelete(id);
    if (!deletedDestination) {
      return res.status(404).json({ message: 'Destination not found' });
    }

    res.status(200).json({ message: 'Destination deleted successfully' });
  } catch (error) {
    console.error('Error deleting destination:', error);
    res.status(500).json({ message: 'Server error', error });
  }
};
