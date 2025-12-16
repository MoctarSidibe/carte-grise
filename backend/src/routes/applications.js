const express = require('express');
const router = express.Router();
const applicationController = require('../controllers/applicationController');
const { authenticate } = require('../middleware/auth');
const { authorize } = require('../middleware/rbac');

router.get('/', authenticate, applicationController.getAllApplications);
router.get('/stats', authenticate, authorize(['SYSTEM_ADMIN', 'ADMIN']), applicationController.getApplicationStats);
router.get('/:id', authenticate, applicationController.getApplicationById);
router.post('/', authenticate, applicationController.createApplication);
router.put('/:id', authenticate, applicationController.updateApplication);
router.delete('/:id', authenticate, applicationController.deleteApplication);
router.post('/:id/submit', authenticate, applicationController.submitApplication);
router.post('/:id/action', authenticate, applicationController.performAction);
router.post('/:id/comments', authenticate, applicationController.addComment);
router.get('/:id/history', authenticate, applicationController.getApplicationHistory);

module.exports = router;
