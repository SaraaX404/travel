import Review from '../../../models/Review'; // Mongoose model for Review
import Destination from '../../../models/Destination'; // Mongoose model for Destination
import connectDB from '../../../utils/connectDB'; // Database connection
import { verifyUser } from '../../../utils/auth'; // JWT user verification

connectDB(); // Ensure database is connected

export default async function handler(req, res) {
  const { destination } = req.query; // Get the destination ID from the query parameters

  switch (req.method) {
    case 'GET':
      await handleGetReviews(req, res, destination);
      break;
    case 'POST':
      await handlePostReview(req, res, destination);
      break;
    default:
      res.status(405).json({ message: 'Method not allowed' });
      break;
  }
}

// Handle GET request to fetch reviews for a specific destination
const handleGetReviews = async (req, res, destination) => {
  try {
    // Fetch reviews associated with the specific destination
    const reviews = await Review.find({ destination }).populate('user', 'username');
    if (!reviews.length) {
      return res.status(404).json({ message: 'No reviews found for this destination' });
    }
    res.status(200).json(reviews);
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({ message: 'Server error', error });
  }
};

// Handle POST request to create a new review for a specific destination
const handlePostReview = async (req, res, destination) => {
  try {
    // Verify if the user is authenticated
    const user = await verifyUser(req);
    if (!user) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const { rating, text } = req.body;

    // Validate required fields
    if (!rating || !text || rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Please provide a valid rating (1-5) and a review text' });
    }

    // Check if the destination exists
    const destinationExists = await Destination.findById(destination);
    if (!destinationExists) {
      return res.status(404).json({ message: 'Destination not found' });
    }

    // Create a new review
    const newReview = new Review({
      user: user.id, // Store the user's ID
      destination, // Store the destination's ID
      rating,
      text,
    });

    // Save the review to the database
    await newReview.save();

    // Return the created review
    res.status(201).json({
      message: 'Review posted successfully',
      review: newReview,
    });
  } catch (error) {
    console.error('Error posting review:', error);
    res.status(500).json({ message: 'Server error', error });
  }
};
