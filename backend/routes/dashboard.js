const express   = require('express');
const router    = express.Router();
const auth      = require('../middleware/auth');
const User      = require('../models/User');
const Timesheet = require('../models/Timesheet');
const Invoice   = require('../models/Invoice');

router.use(auth);

router.get('/summary', async (req, res, next) => {
  try {
    const [
      totalEmployees,
      trackedHoursResult,
      revenueResult,
    ] = await Promise.all([
      User.countDocuments({ role: 'employee', isActive: true }),
      Timesheet.aggregate([
        { $match: { status: 'approved' } },
        { $group: { _id: null, total: { $sum: '$hoursWorked' } } },
      ]),
      Invoice.aggregate([
        { $match: { status: 'paid' } },
        { $group: { _id: null, total: { $sum: '$total' } } },
      ]),
    ]);

    res.json({
      totalEmployees,
      trackedHours: trackedHoursResult[0]?.total || 0,
      revenue:      revenueResult[0]?.total       || 0,
    });
  } catch (err) {
    next(err);
  }
});

router.get('/revenue-overview', async (req, res, next) => {
  try {
    const data = await Invoice.aggregate([
      { $match: { status: 'paid' } },
      {
        $group: {
          _id:     { $month: '$createdAt' },
          revenue: { $sum: '$total' },
        },
      },
      { $sort: { _id: 1 } },
      {
        $project: {
          _id:     0,
          name:    { $arrayElemAt: [['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'], { $subtract: ['$_id', 1] }] },
          revenue: 1,
        },
      },
    ]);

    res.json(data);
  } catch (err) {
    next(err);
  }
});

router.get('/timesheet-stats', async (req, res, next) => {
  try {
    const data = await Timesheet.aggregate([
      {
        $group: {
          _id:   '$status',
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id:   0,
          name:  '$_id',
          value: '$count',
        },
      },
    ]);

    res.json(data);
  } catch (err) {
    next(err);
  }
});

module.exports = router;