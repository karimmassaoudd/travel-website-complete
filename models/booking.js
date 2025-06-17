const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  // User information (can be guest or logged-in user)
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false // Allow guest bookings
  },
  
  // Personal information
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  phone: {
    type: String,
    required: true,
    trim: true
  },
  address: {
    type: String,
    required: true,
    trim: true
  },
  city: {
    type: String,
    required: true,
    trim: true
  },
  country: {
    type: String,
    required: true,
    trim: true
  },
  
  // Travel details
  destination: {
    type: String,
    required: true
  },
  travelDate: {
    type: Date,
    required: true
  },
  returnDate: {
    type: Date,
    required: true
  },
  adults: {
    type: Number,
    required: true,
    min: 1
  },
  children: {
    type: Number,
    required: true,
    min: 0,
    default: 0
  },
  package: {
    type: String,
    required: true
  },
  
  // Additional information
  specialRequests: {
    type: String,
    default: ''
  },
  
  // Payment information
  paymentMethod: {
    type: String,
    required: true,
    enum: ['credit-card', 'paypal', 'bank-transfer']
  },
  totalPrice: {
    type: String, // Store as string to match frontend format like "$1,500"
    required: true
  },
  
  // Booking reference
  bookingReference: {
    type: String,
    required: true,
    unique: true
  },
  
  // Status
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled', 'completed'],
    default: 'confirmed' // Auto-confirm for now
  },
  
  // Payment status
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed', 'refunded'],
    default: 'pending'
  }
}, {
  timestamps: true
});

// Index for faster queries
bookingSchema.index({ email: 1 });
bookingSchema.index({ bookingReference: 1 });
bookingSchema.index({ userId: 1 });

module.exports = mongoose.model('Booking', bookingSchema);

