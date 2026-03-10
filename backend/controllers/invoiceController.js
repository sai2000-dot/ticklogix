const Invoice = require('../models/Invoice');

exports.getAll = async (req, res, next) => {
  try {
    const invoices = await Invoice
      .find()
      .sort({ createdAt: -1 })
      .populate('generatedBy', 'firstName lastName');

    res.json(invoices);
  } catch (err) {
    next(err);
  }
};

exports.getOne = async (req, res, next) => {
  try {
    const invoice = await Invoice
      .findById(req.params.id)
      .populate('generatedBy', 'firstName lastName')
      .populate('timesheetRefs');

    if (!invoice) {
      return res.status(404).json({ error: 'Invoice not found' });
    }

    res.json(invoice);
  } catch (err) {
    next(err);
  }
};

exports.create = async (req, res, next) => {
  try {
    const {
      clientName,
      clientEmail,
      projectName,
      lineItems,
      tax,
      dueDate,
      notes,
      timesheetRefs,
    } = req.body;

    const invoice = await Invoice.create({
      clientName,
      clientEmail,
      projectName,
      lineItems:     lineItems      || [],
      tax:           tax            || 0,
      dueDate,
      notes:         notes          || '',
      timesheetRefs: timesheetRefs  || [],
      generatedBy:   req.user._id,
      status:        'draft',
    });

    res.status(201).json(invoice);
  } catch (err) {
    next(err);
  }
};

exports.updateStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const allowed    = ['draft', 'sent', 'paid', 'overdue'];

    if (!allowed.includes(status)) {
      return res.status(400).json({
        error: `Invalid status. Must be one of: ${allowed.join(', ')}`,
      });
    }

    const update = { status };
    if (status === 'paid') update.paidAt = new Date();

    const invoice = await Invoice.findByIdAndUpdate(
      req.params.id,
      update,
      { new: true }
    );

    if (!invoice) {
      return res.status(404).json({ error: 'Invoice not found' });
    }

    res.json(invoice);
  } catch (err) {
    next(err);
  }
};