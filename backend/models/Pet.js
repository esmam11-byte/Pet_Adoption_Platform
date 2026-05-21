const mongoose = require('mongoose');

const petSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  species: {
    type: String,
    required: true,
    enum: ['Dog', 'Cat', 'Bird', 'Rabbit', 'Other']
  },
  breed: {
    type: String,
    required: true
  },
  age: {
    type: Number,
    required: true,
    min: 0
  },
  gender: {
    type: String,
    required: true,
    enum: ['Male', 'Female']
  },
  imageUrl: {
    type: String,
    required: true
  },
  healthStatus: {
    type: String,
    required: true
  },
  vaccinationStatus: {
    type: String,
    required: true,
    enum: ['Vaccinated', 'Partial', 'Not Vaccinated']
  },
  location: {
    type: String,
    required: true
  },
  adoptionFee: {
    type: Number,
    required: true,
    min: 0
  },
  description: {
    type: String,
    required: true,
    minlength: 20
  },
  ownerEmail: {
    type: String,
    required: true,
    lowercase: true
  },
  status: {
    type: String,
    enum: ['available', 'adopted'],
    default: 'available'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Pet', petSchema);