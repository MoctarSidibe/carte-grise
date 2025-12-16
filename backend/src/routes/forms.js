const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const { authorize } = require('../middleware/rbac');
const formEngine = require('../services/formEngine');
const logger = require('../utils/logger');

router.get('/', authenticate, async (req, res, next) => {
  try {
    const { search, isActive } = req.query;
    const filters = {};
    if (search) filters.search = search;
    if (isActive !== undefined) filters.isActive = isActive === 'true';
    const templates = await formEngine.getAllFormTemplates(filters);
    res.json({ success: true, data: templates });
  } catch (error) {
    logger.error('Error fetching form templates:', error);
    next(error);
  }
});

router.get('/:id/schema', authenticate, async (req, res, next) => {
  try {
    const schema = await formEngine.generateFormSchema(req.params.id);
    res.json({ success: true, data: schema });
  } catch (error) {
    logger.error('Error generating form schema:', error);
    next(error);
  }
});

router.get('/:id/config', authenticate, async (req, res, next) => {
  try {
    const config = await formEngine.generateFormConfig(req.params.id);
    res.json({ success: true, data: config });
  } catch (error) {
    logger.error('Error generating form config:', error);
    next(error);
  }
});

router.get('/:id/dependencies', authenticate, async (req, res, next) => {
  try {
    const dependencies = await formEngine.getFieldDependencies(req.params.id);
    res.json({ success: true, data: dependencies });
  } catch (error) {
    logger.error('Error getting field dependencies:', error);
    next(error);
  }
});

router.post('/:id/validate', authenticate, async (req, res, next) => {
  try {
    const validation = await formEngine.validateFormData(req.params.id, req.body);
    res.json({ success: validation.valid, data: validation });
  } catch (error) {
    logger.error('Error validating form data:', error);
    next(error);
  }
});

router.post('/:id/transform', authenticate, async (req, res, next) => {
  try {
    const transformed = await formEngine.transformFormData(req.params.id, req.body);
    res.json({ success: true, data: transformed });
  } catch (error) {
    logger.error('Error transforming form data:', error);
    next(error);
  }
});

module.exports = router;
