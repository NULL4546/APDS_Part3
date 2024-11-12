import express from 'express';
import Payment from "../models/Payment.js";
import User from "../models/User.js"; 
import authMiddleware from '../middleware/authMiddleware.js'; 

const router = express.Router();

// Base route for payment API
router.get("/", (req, res) => {
  res.send("Hello payment");
});

// Create a new payment
router.post("/make", authMiddleware, async (req, res) => {
    const { amount, description } = req.body;
    const userId = req.user.id; // Extracting authenticated user ID from middleware
  
    // Validate request body
    if (!amount || !description) {
      return res.status(400).json({ message: "Please provide both amount and description" });
    }
  
    // Create a new payment
    const newPayment = new Payment({ userId, amount, description });
  
    try {
      const savedPayment = await newPayment.save();
      res.status(201).json({ message: "Payment created successfully", savedPayment });
    } catch (err) {
      console.error("Error creating payment", err);
      res.status(500).json({ message: "Server error", error: err.message });
    }
});

// Get all payments for a user
router.get('/user/:id', authMiddleware, async (req, res) => {
  try {
      const userId = req.params.id;

      // Check if user exists
      const user = await User.findById(userId);
      if (!user) {
          return res.status(404).json({ message: 'User not found' });
      }

      // Fetch all payments for the user
      const payments = await Payment.find({ userId });
      res.status(200).json(payments);
  } catch (error) {
      console.error("Error fetching payments", error);
      res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});

// Update payment status
router.put('/:id', authMiddleware, async (req, res) => {
  try {
      const paymentId = req.params.id;
      const { status } = req.body;

      // Validate status
      const validStatuses = ['pending', 'completed', 'failed'];
      if (!validStatuses.includes(status)) {
          return res.status(400).json({ message: 'Invalid payment status' });
      }

      // Find and update the payment status
      const payment = await Payment.findByIdAndUpdate(
          paymentId,
          { status },
          { new: true }
      );

      if (!payment) {
          return res.status(404).json({ message: 'Payment not found' });
      }

      res.status(200).json({ message: 'Payment status updated', payment });
  } catch (error) {
      console.error("Error updating payment status", error);
      res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});

export default router;