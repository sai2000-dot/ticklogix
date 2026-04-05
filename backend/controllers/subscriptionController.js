const User = require('../models/User');

const PLAN_PRICES = {
  starter:      9,
  professional: 29,
  business:     79,
  enterprise:   199,
};

exports.upgrade = async (req, res, next) => {
  try {
    const { plan, paymentMethod } = req.body;

    if (!PLAN_PRICES[plan]) {
      return res.status(400).json({ error: 'Invalid plan selected' });
    }

    // Simulate payment processing delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    const expiry = new Date();
    expiry.setMonth(expiry.getMonth() + 1);

    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        subscriptionPlan:   plan,
        subscriptionStatus: 'active',
        subscriptionExpiry: expiry,
      },
      { new: true }
    );

    res.json({
      success: true,
      message: `Subscription upgraded to ${plan} plan successfully`,
      user: {
        subscriptionPlan:   user.subscriptionPlan,
        subscriptionStatus: user.subscriptionStatus,
        subscriptionExpiry: user.subscriptionExpiry,
      },
    });
  } catch (err) {
    next(err);
  }
};

exports.getStatus = async (req, res) => {
  const user = req.user;
  const trialStart = new Date(user.trialStartDate || user.createdAt);
  const now = new Date();
  const diffDays = Math.floor((now - trialStart) / (1000 * 60 * 60 * 24));
  const trialDaysLeft = Math.max(0, 7 - diffDays);

  res.json({
    subscriptionPlan:   user.subscriptionPlan,
    subscriptionStatus: user.subscriptionStatus,
    subscriptionExpiry: user.subscriptionExpiry,
    trialStartDate:     user.trialStartDate,
    trialDaysLeft,
    isTrialExpired: user.subscriptionStatus === 'trial' && trialDaysLeft === 0,
  });
};
