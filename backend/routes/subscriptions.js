const express = require('express');
const router  = express.Router();
const auth    = require('../middleware/auth');
const ctrl    = require('../controllers/subscriptionController');

router.use(auth);

router.get('/status',  ctrl.getStatus);
router.post('/upgrade', ctrl.upgrade);

module.exports = router;
