const express = require('express');
const router = express.Router();
const workflowController = require('../controllers/workflowController');
const { authenticate } = require('../middleware/auth');
const { authorize } = require('../middleware/rbac');

router.get('/', authenticate, workflowController.getAllWorkflows);
router.get('/:id', authenticate, workflowController.getWorkflowById);
router.post('/', authenticate, authorize(['SYSTEM_ADMIN', 'ADMIN']), workflowController.createWorkflow);
router.put('/:id', authenticate, authorize(['SYSTEM_ADMIN', 'ADMIN']), workflowController.updateWorkflow);
router.delete('/:id', authenticate, authorize(['SYSTEM_ADMIN', 'ADMIN']), workflowController.deleteWorkflow);
router.post('/:id/duplicate', authenticate, authorize(['SYSTEM_ADMIN', 'ADMIN']), workflowController.duplicateWorkflow);
router.get('/:id/steps', authenticate, workflowController.getWorkflowSteps);
router.post('/:id/steps', authenticate, authorize(['SYSTEM_ADMIN', 'ADMIN']), workflowController.createWorkflowStep);
router.put('/:workflowId/steps/:stepId', authenticate, authorize(['SYSTEM_ADMIN', 'ADMIN']), workflowController.updateWorkflowStep);
router.delete('/:workflowId/steps/:stepId', authenticate, authorize(['SYSTEM_ADMIN', 'ADMIN']), workflowController.deleteWorkflowStep);
router.put('/:id/steps/reorder', authenticate, authorize(['SYSTEM_ADMIN', 'ADMIN']), workflowController.reorderWorkflowSteps);

module.exports = router;
