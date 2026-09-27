const Project = require('../models/Project');
const Inquiry = require('../models/Inquiry');
const Testimonial = require('../models/Testimonial');
const asyncHandler = require('../utils/asyncHandler');

// GET /api/stats/dashboard — shaped so Recharts can consume each array directly.
const getDashboardStats = asyncHandler(async (req, res) => {
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
  sixMonthsAgo.setDate(1);
  sixMonthsAgo.setHours(0, 0, 0, 0);

  const [totals, inquiriesByStatus, projectsByCategory, monthlyInquiries, avgRating] =
    await Promise.all([
      Promise.all([
        Project.countDocuments(),
        Inquiry.countDocuments(),
        Inquiry.countDocuments({ status: 'new' }),
        Inquiry.countDocuments({ status: 'won' }),
      ]),
      Inquiry.aggregate([
        { $group: { _id: '$status', value: { $sum: 1 } } },
        { $project: { _id: 0, name: '$_id', value: 1 } },
      ]),
      Project.aggregate([
        { $group: { _id: '$category', value: { $sum: 1 } } },
        { $project: { _id: 0, name: '$_id', value: 1 } },
        { $sort: { value: -1 } },
      ]),
      Inquiry.aggregate([
        { $match: { createdAt: { $gte: sixMonthsAgo } } },
        {
          $group: {
            _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
            inquiries: { $sum: 1 },
            won: { $sum: { $cond: [{ $eq: ['$status', 'won'] }, 1, 0] } },
          },
        },
        { $project: { _id: 0, month: '$_id', inquiries: 1, won: 1 } },
        { $sort: { month: 1 } },
      ]),
      Testimonial.aggregate([
        { $match: { approved: true } },
        { $group: { _id: null, avg: { $avg: '$rating' }, count: { $sum: 1 } } },
      ]),
    ]);

  const [totalProjects, totalInquiries, newInquiries, wonInquiries] = totals;

  res.json({
    success: true,
    data: {
      cards: {
        totalProjects,
        totalInquiries,
        newInquiries,
        wonInquiries,
        conversionRate: totalInquiries ? +((wonInquiries / totalInquiries) * 100).toFixed(1) : 0,
        averageRating: avgRating[0] ? +avgRating[0].avg.toFixed(1) : 0,
        reviewCount: avgRating[0] ? avgRating[0].count : 0,
      },
      inquiriesByStatus,
      projectsByCategory,
      monthlyInquiries,
    },
  });
});

module.exports = { getDashboardStats };
