const express       = require('express');
const router        = express.Router();
const auth          = require('../middleware/auth');
const rbac          = require('../middleware/rbac');
const userController = require('../controllers/userController');

router.use(auth);

router.get('/',      rbac(['manager','admin']), userController.getAll);
router.get('/:id',   rbac(['manager','admin']), userController.getOne);
router.patch('/:id', rbac(['admin']),           userController.update);

module.exports = router;