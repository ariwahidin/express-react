const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');

// Get all categories
router.get('/', categoryController.getCategories);

// Create a new category
router.post('/', categoryController.addCategory);

// Update an product
// router.put('/:id', productController.updateProduct);

// Delete an product
// router.delete('/:id', productController.deleteProduct);

module.exports = router;