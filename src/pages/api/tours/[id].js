import Tour from '../../../models/Tour'; // Mongoose model for Tour
import connectDB from '../../../utils/connectDB'; // Database connection
import { verifyAdmin } from '../../../utils/auth'; // JWT admin verification

connectDB(); // Ensure database is connected

export default async function handler(req, res) {
  const { id } = req.query; // Get the tour ID from the query parameters

  switch (req.method) {
    case 'GET':
      await handleGetTour(req, res, id);
      break;
    case 'PUT':
      await handleUpdateTour(req, res, id);
      break;
    case 'DELETE':
      await handleDeleteTour(req, res, id);
      break;
    default:
      res.status(405).json({ message: 'Method not allowed' });
      break;
  }
}

// Handle GET request to fetch details of a specific tour
const handleGetTour = async (req, res, id) => {
  try {
    // Fetch the specific tour by its ID
    const tour = await Tour.findById(id).populate('destinations hotels');
    if (!tour) {
      return res.status(404).json({ message: 'Tour not found' });
    }
    res.status(200).json(tour);
  } catch (error) {
    console.error('Error fetching tour:', error);
    res.status(500).json({ message: 'Server error', error });
  }
};

// Handle PUT request to update details of a specific tour (admin only)
const handleUpdateTour = async (req, res, id) => {
  try {
    // Verify if the user is an admin
    const admin = await verifyAdmin(req);
    if (!admin) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const { name, description, duration, destinations, hotels } = req.body;

    // Update the tour details
    const updatedTour = await Tour.findByIdAndUpdate(
      id,
      {
        name,
        description,
        duration,
        destinations,
        hotels,
      },
      { new: true } // Return the updated document
    );

    if (!updatedTour) {
      return res.status(404).json({ message: 'Tour not found' });
    }

    res.status(200).json(updatedTour);
  } catch (error) {
    console.error('Error updating tour:', error);
    res.status(500).json({ message: 'Server error', error });
  }
};

// Handle DELETE request to delete a specific tour (admin only)
const handleDeleteTour = async (req, res, id) => {
  try {
    // Verify if the user is an admin
    const admin = await verifyAdmin(req);
    if (!admin) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Find and delete the tour
    const deletedTour = await Tour.findByIdAndDelete(id);
    if (!deletedTour) {
      return res.status(404).json({ message: 'Tour not found' });
    }

    res.status(200).json({ message: 'Tour deleted successfully' });
  } catch (error) {
    console.error('Error deleting tour:', error);
    res.status(500).json({ message: 'Server error', error });
  }
};
