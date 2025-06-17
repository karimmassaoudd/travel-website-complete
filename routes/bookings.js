const express = require('express');
const router = express.Router();
const Booking = require('../models/booking');
const User = require('../models/user');
const jwt = require('jsonwebtoken');

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key_change_in_production';

// Helper function to get user from token (if provided)
const getUserFromToken = async (req) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '') || 
                  req.header('x-auth-token') ||
                  req.body.token;
    
    if (!token) return null;
    
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.id);
    return user;
  } catch (error) {
    return null;
  }
};

// GET all bookings (admin only in a real app)
router.get('/', async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('userId', 'name email')
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({ message: 'Server error while fetching bookings' });
  }
});

// GET specific booking by ID
router.get('/:id', async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('userId', 'name email');
    
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    
    res.json(booking);
  } catch (error) {
    console.error('Error fetching booking:', error);
    res.status(500).json({ message: 'Server error while fetching booking' });
  }
});

// GET booking by reference number
router.get('/reference/:ref', async (req, res) => {
  try {
    const booking = await Booking.findOne({ bookingReference: req.params.ref })
      .populate('userId', 'name email');
    
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    
    res.json(booking);
  } catch (error) {
    console.error('Error fetching booking by reference:', error);
    res.status(500).json({ message: 'Server error while fetching booking' });
  }
});

// POST create new booking
router.post('/', async (req, res) => {
  try {
    console.log('Received booking data:', req.body);
    
    // Validate required fields
    const requiredFields = [
      'destination', 'travelDate', 'returnDate', 'adults', 'package',
      'firstName', 'lastName', 'email', 'phone', 'address', 'city', 'country',
      'paymentMethod', 'bookingReference', 'totalPrice'
    ];
    
    const missingFields = requiredFields.filter(field => !req.body[field]);
    if (missingFields.length > 0) {
      return res.status(400).json({ 
        message: `Missing required fields: ${missingFields.join(', ')}` 
      });
    }
    
    // Check if booking reference already exists
    const existingBooking = await Booking.findOne({ 
      bookingReference: req.body.bookingReference 
    });
    if (existingBooking) {
      return res.status(400).json({ 
        message: 'Booking reference already exists. Please try again.' 
      });
    }
    
    // Get user if logged in
    const user = await getUserFromToken(req);
    
    // Prepare booking data
    const bookingData = {
      ...req.body,
      userId: user ? user._id : null,
      children: req.body.children || 0,
      specialRequests: req.body.specialRequests || '',
      status: 'confirmed',
      paymentStatus: 'pending'
    };
    
    // Validate dates
    const travelDate = new Date(bookingData.travelDate);
    const returnDate = new Date(bookingData.returnDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (travelDate < today) {
      return res.status(400).json({ 
        message: 'Travel date cannot be in the past' 
      });
    }
    
    if (returnDate <= travelDate) {
      return res.status(400).json({ 
        message: 'Return date must be after travel date' 
      });
    }
    
    // Create booking
    const booking = new Booking(bookingData);
    const savedBooking = await booking.save();
    
    // If user is logged in, add booking to user's bookings array
    if (user) {
      await User.findByIdAndUpdate(
        user._id,
        { $push: { bookings: savedBooking._id } }
      );
    }
    
    console.log('Booking saved successfully:', savedBooking._id);
    
    res.status(201).json({
      message: 'Booking created successfully',
      booking: savedBooking,
      bookingReference: savedBooking.bookingReference
    });
    
  } catch (error) {
    console.error('Error creating booking:', error);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ 
        message: 'Validation error',
        errors: validationErrors 
      });
    }
    
    // Handle duplicate key errors
    if (error.code === 11000) {
      return res.status(400).json({ 
        message: 'Booking reference already exists. Please try again.' 
      });
    }
    
    res.status(500).json({ 
      message: 'Server error while creating booking',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// PUT update booking
router.put('/:id', async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    
    // Check if user owns this booking (if logged in)
    const user = await getUserFromToken(req);
    if (user && booking.userId && !booking.userId.equals(user._id)) {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    // Update booking
    const updatedBooking = await Booking.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    res.json({
      message: 'Booking updated successfully',
      booking: updatedBooking
    });
    
  } catch (error) {
    console.error('Error updating booking:', error);
    
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ 
        message: 'Validation error',
        errors: validationErrors 
      });
    }
    
    res.status(500).json({ 
      message: 'Server error while updating booking' 
    });
  }
});

// DELETE cancel booking
router.delete('/:id', async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    
    // Check if user owns this booking (if logged in)
    const user = await getUserFromToken(req);
    if (user && booking.userId && !booking.userId.equals(user._id)) {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    // Update booking status to cancelled instead of deleting
    booking.status = 'cancelled';
    await booking.save();
    
    res.json({ 
      message: 'Booking cancelled successfully',
      booking: booking
    });
    
  } catch (error) {
    console.error('Error cancelling booking:', error);
    res.status(500).json({ 
      message: 'Server error while cancelling booking' 
    });
  }
});

// GET user's bookings (requires authentication)
router.get('/user/my-bookings', async (req, res) => {
  try {
    const user = await getUserFromToken(req);
    if (!user) {
      return res.status(401).json({ message: 'Authentication required' });
    }
    
    const bookings = await Booking.find({ userId: user._id })
      .sort({ createdAt: -1 });
    
    res.json(bookings);
    
  } catch (error) {
    console.error('Error fetching user bookings:', error);
    res.status(500).json({ 
      message: 'Server error while fetching bookings' 
    });
  }
});

module.exports = router;

