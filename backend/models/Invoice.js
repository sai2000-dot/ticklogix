const mongoose = require('mongoose');

const lineItemSchema = new mongoose.Schema(
    {
        description: { type: String, required: true },
        hours:       { type: Number, required: true, min: 0 },
        rate:        { type: Number, required: true, min: 0 },
        amount:      { type: Number, required: true, min: 0 },
    },
    {_id: false }
);

const invoiceSchema = new mongoose.Schema(
    {
        invoiceNumber: { type: String, unquie: true },
        clientName:    { type: String, required: true, trim: true },
        clientEmail:   { type: String, default:'', trim: true},
        projectName:   { type: String, required: true, trim: true },
        timesheetRefs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Timesheet' }],
        lineItems:     [lineItemSchema],
        subtotal:      { type: Number, default: 0 },
        tax:           { type: Number, default: 0 },
        total:         { type: Number, default: 0 },
        status:{
            type: String,
            enum: ['draft', 'sent', 'paid', 'overdue'],
            default: 'draft',
        },
        dueDate:      { type: Date, required: true },
        paidAt:       { type: Date },
        notes:        { type: String, default: '' },
        generatedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref:  'User',
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

invoiceSchema.pre('save', async function () {
  if (this.invoiceNumber) return;
  const year  = new Date().getFullYear();
  const count = await mongoose.model('Invoice').countDocuments();
  const seq   = String(count + 1).padStart(3, '0');
  this.invoiceNumber = `INV-${year}-${seq}`;
});

invoiceSchema.pre('save', function () {
  this.subtotal = this.lineItems.reduce((sum, item) => sum + item.amount, 0);
  this.total    = this.subtotal + (this.subtotal * this.tax / 100);
});

invoiceSchema.index({ status: 1});
invoiceSchema.index({ generatedBy: 1});

module.exports = mongoose.model('Invoice', invoiceSchema);
