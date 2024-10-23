import Destination from '../../../models/Destination'; // Mongoose model for Destination
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

    const { name, description, location, image, hotels } = req.body;

    // Validate required fields
    if (!name || !description || !location) {
      return res.status(400).json({ message: 'Please provide name, description, and location' });
    }

    // Create a new destination
    const newDestination = new Destination({
      name,
      description,
      location,
      image, // Image URL (optional)
      hotels, // Array of hotel IDs (optional)
      createdBy: admin.id, // Store the admin's user ID
    });

    // Save the destination to the database
    await newDestination.save();

    // Return the created destination
    res.status(201).json({
      message: 'Destination created successfully',
      destination: newDestination,
    });
  } catch (error) {
    console.error('Error creating destination:', error);
    res.status(500).json({ message: 'Server error', error });
  }
}
