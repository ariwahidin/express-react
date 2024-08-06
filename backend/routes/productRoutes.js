const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

// Get all product
router.get('/', productController.getProduct);

// Create a new product
router.post('/', productController.addProduct);

// Update an product
router.put('/:id', productController.updateProduct);

// Delete an product
router.delete('/:id', productController.deleteProduct);

router.post('/restock/add', productController.addProductVariations);

module.exports = router;