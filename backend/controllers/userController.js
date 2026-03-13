const User = require('../models/User');

exports.getAll = async (req, res, next) => {
  try {
    const filter = req.user.role === 'manager' ? { role: { $ne: 'admin' } } : {};
    const users  = await User.find(filter).sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    next(err);
  }
};

exports.getOne = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err) {
    next(err);
  }
};

exports.update = async (req, res, next) => {
  try {
    const { role, department, isActive } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role, department, isActive },
      { new: true, runValidators: true }
    );
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err) {
    next(err);
  }
};