const mongoose = require('mongoose');

// A completed piece of work shown in the portfolio / gallery.
const projectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, unique: true, lowercase: true, index: true },
    category: {
      type: String,
      required: true,
      enum: ['kitchen', 'wardrobe', 'furniture', 'interior', 'doors', 'office', 'other'],
      index: true,
    },
    description: { type: String, required: true },
    material: { type: String, trim: true },
    location: { type: String, trim: true },
    completedOn: { type: Date },
    durationDays: { type: Number, min: 0 },
    images: [{ type: String }],
    coverImage: { type: String },
    featured: { type: Boolean, default: false, index: true },
    published: { type: Boolean, default: true, index: true },
  },
  { timestamps: true }
);

projectSchema.pre('validate', function buildSlug(next) {
  if (this.isModified('title') || !this.slug) {
    this.slug = `${this.title}`
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
      .concat('-', Date.now().toString(36));
  }
  next();
});

module.exports = mongoose.model('Project', projectSchema);
