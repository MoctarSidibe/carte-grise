const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticate } = require('../middleware/auth');
const { authorize } = require('../middleware/rbac');

router.get('/', authenticate, authorize(['SYSTEM_ADMIN', 'ADMIN']), userController.getAllUsers);
router.get('/stats', authenticate, authorize(['SYSTEM_ADMIN', 'ADMIN']), userController.getUserStats);
router.get('/:id', authenticate, userController.getUserById);
router.post('/', authenticate, authorize(['SYSTEM_ADMIN', 'ADMIN']), userController.createUser);
router.put('/:id', authenticate, userController.updateUser);
router.delete('/:id', authenticate, authorize(['SYSTEM_ADMIN']), userController.deleteUser);
router.post('/:id/roles', authenticate, authorize(['SYSTEM_ADMIN', 'ADMIN']), userController.assignRoles);
router.patch('/:id/status', authenticate, authorize(['SYSTEM_ADMIN', 'ADMIN']), userController.updateUserStatus);
router.post('/:id/reset-password', authenticate, authorize(['SYSTEM_ADMIN', 'ADMIN']), userController.resetPassword);

module.exports = router;
