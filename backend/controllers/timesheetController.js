const Timesheet = require('../models/Timesheet');

exports.getAll = async (req, res, next) => {
  try {
    const filter = req.user.role === 'employee'
      ? { employeeId: req.user._id }
      : {};

    const timesheets = await Timesheet
      .find(filter)
      .sort({ createdAt: -1 })
      .populate('employeeId', 'firstName lastName')
      .populate('approvedBy', 'firstName lastName');

    res.json(timesheets);
  } catch (err) {
    next(err);
  }
};

exports.create = async (req, res, next) => {
  try {
    const { project, client, date, hoursWorked, description } = req.body;

    const timesheet = await Timesheet.create({
      employeeId:   req.user._id,
      employeeName: `${req.user.firstName} ${req.user.lastName}`,
      project,
      client,
      date,
      hoursWorked,
      description,
      status: 'draft',
    });

    res.status(201).json(timesheet);
  } catch (err) {
    next(err);
  }
};

exports.submit = async (req, res, next) => {
  try {
    const timesheet = await Timesheet.findById(req.params.id);

    if (!timesheet) {
      return res.status(404).json({ error: 'Timesheet not found' });
    }

    if (timesheet.employeeId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    if (timesheet.status !== 'draft') {
      return res.status(400).json({ error: `Cannot submit a ${timesheet.status} timesheet` });
    }

    timesheet.status      = 'submitted';
    timesheet.submittedAt = new Date();
    await timesheet.save();

    res.json(timesheet);
  } catch (err) {
    next(err);
  }
};

exports.approve = async (req, res, next) => {
  try {
    const timesheet = await Timesheet.findById(req.params.id);

    if (!timesheet) {
      return res.status(404).json({ error: 'Timesheet not found' });
    }

    if (timesheet.status !== 'submitted') {
      return res.status(400).json({ error: `Cannot approve a ${timesheet.status} timesheet` });
    }

    const updated = await Timesheet.findByIdAndUpdate(
      req.params.id,
      {
        status:     'approved',
        approvedAt: new Date(),
        approvedBy: req.user._id,
      },
      { new: true }
    ).populate('approvedBy', 'firstName lastName');

    res.json(updated);
  } catch (err) {
    next(err);
  }
};

exports.reject = async (req, res, next) => {
  try {
    const { reason } = req.body;
    const timesheet  = await Timesheet.findById(req.params.id);

    if (!timesheet) {
      return res.status(404).json({ error: 'Timesheet not found' });
    }

    if (timesheet.status !== 'submitted') {
      return res.status(400).json({ error: `Cannot reject a ${timesheet.status} timesheet` });
    }

    timesheet.status          = 'rejected';
    timesheet.rejectedAt      = new Date();
    timesheet.rejectionReason = reason || '';
    await timesheet.save();

    res.json(timesheet);
  } catch (err) {
    next(err);
  }
};