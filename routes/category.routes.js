const express = require('express');
const router = express.Router();
const {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
  getCategoryTree
} = require('../service/category.service');
const { authMiddleware } = require('../middleware/auth.middleware');
const { canManageProducts } = require('../middleware/role.middleware');

// Public routes
router.get('/', async (req, res) => await getCategories(req, res));
router.get('/tree', async (req, res) => await getCategoryTree(req, res));
router.get('/:id', async (req, res) => await getCategoryById(req, res));

// Protected routes (require authentication and appropriate role)
router.post('/', authMiddleware, canManageProducts, async (req, res) => await createCategory(req, res));
router.put('/:id', authMiddleware, canManageProducts, async (req, res) => await updateCategory(req, res));
router.delete('/:id', authMiddleware, canManageProducts, async (req, res) => await deleteCategory(req, res));

module.exports = router; 