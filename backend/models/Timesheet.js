const mongoose = require('mongoose');
 const timesheetSchema = new mongoose.Schema(
    {
        employeeId: {
            type: mongoose.Schema.Types.ObjectId,
            ref:  'User',
            required: true,
        },
        employeeName: { type: String, required: true},
        project:      { type: String, required: true, trim: true },
        client:       { type: String, default: '', trim: true },
        date:         { type: Date, required: true },
        hoursWorked:  { type: Number, required: true, min: 0.5, max: 24 },
        description:  { type: String, default: '', trim: true},
        status: {
            type: String,
            enum: ['draft', 'submitted', 'approved', 'rejected'],
            default: 'draft',
        },
        submittedAt:   { type: Date },
        approvedAt:    { type: Date },
        rejectedAt:    { type: Date },
        approvedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        rejectionReason: { type: String, default: ''},
    },
    {
        timestamps: true,
    }
 );
 timesheetSchema.index({ employeeId: 1 });
 timesheetSchema.index({ status: 1});
 timesheetSchema.index({ date: -1});

 module.exports =mongoose.model('Timesheet', timesheetSchema);