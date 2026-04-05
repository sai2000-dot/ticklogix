const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const userSchema = new mongoose.Schema(
    {
        firstName: { type: String, required: true, trim: true},
        lastName:  { type: String, required: true, trim: true},
        username:  { type: String, required: true, unique: true, trim: true, lowercase: true},
        email:     { type: String, required: true, unique: true, trim: true, lowercase: true},
        password:  { type: String, required: true, select: false},
        role: {
            type: String,
            enum: ['employee', 'manager', 'admin'],
            default: 'employee',
        },
        department: { type: String, default: ''},
        isActive:   { type: Boolean, default: true }, 
        authProvider: { type: String, enum: ['local', 'google', 'microsoft'], default: 'local' },
        googleId:     { type: String },
        microsoftId:  { type: String },
        trialStartDate:     { type: Date, default: Date.now },
        subscriptionPlan:   { type: String, enum: ['trial', 'starter', 'professional', 'business', 'enterprise'], default: 'trial' },
        subscriptionStatus: { type: String, enum: ['trial', 'active', 'expired', 'cancelled'], default: 'trial' },
        subscriptionExpiry: { type: Date, default: null },
    },
    {
        timestamps: true,
    }
);

userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, 12);
});

userSchema.methods.comparePassword = async function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);