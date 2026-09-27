// Seeds an admin user plus demo content. Run once with: npm run seed
require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const User = require('../models/User');
const Service = require('../models/Service');
const Project = require('../models/Project');
const Inquiry = require('../models/Inquiry');

const run = async () => {
  await connectDB();

  await User.deleteMany({});
  await Service.deleteMany({});
  await Project.deleteMany({});
  await Inquiry.deleteMany({});

  await User.create({
    name: 'Admin',
    email: 'bharathishree1301@gmail.com',
    password: 'Bharu@1301',
    role: 'admin',
  });

  await Service.insertMany([
    { name: 'Modular Kitchens', description: 'Custom modular kitchen design and installation.', icon: 'ChefHat', startingPrice: 1200, priceUnit: 'per_sqft', order: 1 },
    { name: 'Wardrobes', description: 'Built-in and walk-in wardrobes in plywood or solid wood.', icon: 'DoorClosed', startingPrice: 900, priceUnit: 'per_sqft', order: 2 },
    { name: 'Custom Furniture', description: 'Beds, dining sets, TV units and study tables made to order.', icon: 'Armchair', priceUnit: 'per_piece', order: 3 },
    { name: 'Full Home Interiors', description: 'End-to-end interior carpentry for new homes.', icon: 'Home', priceUnit: 'per_project', order: 4 },
  ]);

  await Project.insertMany([
    { title: 'Teak Modular Kitchen', category: 'kitchen', description: 'L-shaped modular kitchen in teak with soft-close fittings.', material: 'Teak', location: 'Saibaba Colony', durationDays: 18, featured: true },
    { title: 'Sliding Wardrobe', category: 'wardrobe', description: 'Three-door sliding wardrobe with mirror panel and internal drawers.', material: 'Marine plywood', location: 'RS Puram', durationDays: 10 },
    { title: 'Office Workstations', category: 'office', description: 'Six-seat workstation cluster with cable management.', material: 'MDF', location: 'Peelamedu', durationDays: 12 },
  ]);

  const statuses = ['new', 'contacted', 'quoted', 'won', 'lost'];
  const demoInquiries = Array.from({ length: 24 }, (_, i) => {
    const d = new Date();
    d.setMonth(d.getMonth() - (i % 6));
    return {
      name: `Client ${i + 1}`,
      phone: `98${String(400000 + i).padStart(8, '0')}`.slice(0, 10),
      message: 'Looking for a quote on interior work.',
      serviceType: 'Custom Furniture',
      status: statuses[i % statuses.length],
      createdAt: d,
    };
  });
  await Inquiry.insertMany(demoInquiries);

  console.log('Seeded. Login with admin@example.com / changeme123 — change this immediately.');
  await mongoose.connection.close();
};

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
