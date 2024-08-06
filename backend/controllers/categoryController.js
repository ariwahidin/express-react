const { poolPromise } = require('../config/dbConfig');
const moment = require('moment-timezone');

// Get ALL Categories
const getCategories = async (req, res) => {
    try {
        const pool = await poolPromise;
        const query = 'SELECT * FROM Categories';
        pool.query(query, (err, result) => {
            if (err) {
                console.error('Error fetching categories: ', err);
                res.status(500).send('Error fetching categories');
            } else {
                res.json(result);
            }
        });
    } catch (err) {
        console.error('Error fetching categories: ', err);
        res.status(500).send('Error fetching categories');
    }
};

// Add Category
const addCategory = async (req, res) => {
    try {
        const { categoryName} = req.body;
        const currentTime = moment().tz('Asia/Jakarta').format('YYYY-MM-DD HH:mm:ss');
        const userId = req.userId;
        const pool = await poolPromise;

        const query = 'INSERT INTO Categories (categoryName, created_at, created_by) VALUES (?, ?, ?)';
        pool.query(query, [categoryName, currentTime, userId], (err, result) => {
            if (err) {
                console.error('Error adding category: ', err);
                res.status(500).send('Error adding category');
            } else {
                res.status(201).send('New category added successfully');
            }
        });
    } catch (err) {
        console.error('Error adding category: ', err);
        res.status(500).send('Error adding category');
    }
};

// Update an order
const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const { productName, price } = req.body;
        const conn = await poolPromise;

        const query = `
        UPDATE Products
        SET productName = ?, price = ?, updated_by = ?
        WHERE id = ?
      `;

        conn.query(query, [productName, price, req.userId, id], (err, result) => {
            if (err) {
                console.error('Error updating product: ', err);
                return res.status(500).send('Error updating product');
            }
            res.status(200).send('Product updated successfully');
        });
    } catch (err) {
        console.error('Error updating product : ', err);
        res.status(500).send('Error updating product');
    }
};
// Delete Order
const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const conn = await poolPromise;

        const query = `
        DELETE FROM Products
        WHERE id = ?
      `;

        conn.query(query, [id], (err, result) => {

            console.log("baris terpengaruh : " + result)

            if (err) {
                console.error('Failed to delete product:', err);
                return res.status(500).json({ error: 'Failed to delete product' });
            }

            if (result.rowsAffected === 0) {
                return res.status(404).json({ error: 'Product not found' });
            }

            res.status(201).send('Delete product successfully');
        });
    } catch (err) {
        console.error('Failed to delete product:', err);
        res.status(500).json({ error: 'Failed to delete product' });
    }
};

module.exports = {
    getCategories,
    addCategory,
    updateProduct,
    deleteProduct
};
