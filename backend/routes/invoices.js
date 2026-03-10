const express = require('express');
const router  = express.Router();
const auth    = require('../middleware/auth');
const rbac    = require('../middleware/rbac');
const ctrl    = require('../controllers/invoiceController');

router.use(auth);

router.get('/',              ctrl.getAll);
router.get('/:id',           ctrl.getOne);
router.post('/',             rbac('manager', 'admin'), ctrl.create);
router.patch('/:id/status',  rbac('manager', 'admin'), ctrl.updateStatus);

module.exports = router;