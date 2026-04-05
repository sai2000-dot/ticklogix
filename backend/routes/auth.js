const express    = require('express');
const router     = express.Router();
const passport   = require('../config/passport');
const jwt        = require('jsonwebtoken');
const auth       = require('../middleware/auth');
const authController = require('../controllers/authController');

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '8h',
  });

// Local auth
router.post('/register', authController.register);
router.post('/login',    authController.login);
router.get('/me',        auth, authController.getMe);

// Google OAuth
router.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email'], session: false })
);

router.get('/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: `${process.env.FRONTEND_URL}?error=google_failed` }),
  (req, res) => {
    const token = signToken(req.user._id);
    res.redirect(`${process.env.FRONTEND_URL}/auth/callback?token=${token}`);
  }
);

// Microsoft OAuth
router.get('/microsoft',
  passport.authenticate('microsoft', { session: false })
);

router.get('/microsoft/callback',
  passport.authenticate('microsoft', { session: false, failureRedirect: `${process.env.FRONTEND_URL}?error=microsoft_failed` }),
  (req, res) => {
    const token = signToken(req.user._id);
    res.redirect(`${process.env.FRONTEND_URL}/auth/callback?token=${token}`);
  }
);

module.exports = router;