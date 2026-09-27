const mongoose = require('mongoose');

// A lead captured from the contact form or the chatbot.
const inquirySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    phone: {
      type: String,
      required: true,
      trim: true,
      match: [/^[0-9+\-\s]{7,15}$/, 'Invalid phone number'],
    },
    email: { type: String, lowercase: true, trim: true },
    serviceType: { type: String, trim: true },
    budget: { type: Number, min: 0 },
    message: { type: String, required: true, maxlength: 2000 },
    source: { type: String, enum: ['website', 'whatsapp', 'chatbot', 'referral'], default: 'website' },
    status: {
      type: String,
      enum: ['new', 'contacted', 'quoted', 'won', 'lost'],
      default: 'new',
      index: true,
    },
    notes: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Inquiry', inquirySchema);
