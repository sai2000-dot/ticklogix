const jwt  = require('jsonwebtoken');
const User = require('../models/User');

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '8h',
  });

exports.register = async (req, res, next) => {
  try {
    const { firstName, lastName, username, email, password, role } = req.body;

    const user = await User.create({
      firstName,
      lastName,
      username,
      email,
      password,
      role,
    });

    const token = signToken(user._id);

    res.status(201).json({
      token,
      user: {
        id:        user._id,
        username:  user.username,
        role:      user.role,
        firstName: user.firstName,
        lastName:  user.lastName,
      },
    });
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    const user = await User.findOne({ username }).select('+password');

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = signToken(user._id);

    res.json({
      token,
      user: {
        id:        user._id,
        username:  user.username,
        role:      user.role,
        firstName: user.firstName,
        lastName:  user.lastName,
      },
    });
  } catch (err) {
    next(err);
  }
};

exports.getMe = async (req, res) => {
  res.json({
    id:         req.user._id,
    username:   req.user.username,
    firstName:  req.user.firstName,
    lastName:   req.user.lastName,
    email:      req.user.email,
    role:       req.user.role,
    department: req.user.department,
  });
};