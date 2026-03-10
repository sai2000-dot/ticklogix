const express = require('express');
const router  = express.Router();
const auth    = require('../middleware/auth');
const rbac    = require('../middleware/rbac');
const ctrl    = require('../controllers/timesheetController');

router.use(auth);

router.get('/',                ctrl.getAll);
router.post('/',               ctrl.create);
router.patch('/:id/submit',    ctrl.submit);
router.patch('/:id/approve',   rbac('manager', 'admin'), ctrl.approve);
router.patch('/:id/reject',    rbac('manager', 'admin'), ctrl.reject);

module.exports = router;