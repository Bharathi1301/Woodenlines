const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    icon: { type: String, default: 'Hammer' }, // lucide-react icon name
    startingPrice: { type: Number, min: 0 },
    priceUnit: { type: String, enum: ['per_sqft', 'per_piece', 'per_project'], default: 'per_project' },
    active: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Service', serviceSchema);
