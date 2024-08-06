const { poolPromise } = require('../config/dbConfig');
const moment = require('moment-timezone');

// Get Products
const getProduct = async (req, res) => {
    try {
        const pool = await poolPromise;
        const query = 'SELECT * FROM Products';
        pool.query(query, (err, result) => {
            if (err) {
                console.error('Error fetching products: ', err);
                res.status(500).send('Error fetching products');
            } else {
                res.json(result);
            }
        });
    } catch (err) {
        console.error('Error fetching products: ', err);
        res.status(500).send('Error fetching products');
    }
};

// Add Order
const addProduct = async (req, res) => {
    try {
        const { productName, categoryId, price } = req.body;
        const userId = req.userId;
        const pool = await poolPromise;

        console.log(userId)

        const query = 'INSERT INTO Products (productName, category_id, price, created_by) VALUES (?, ?, ?, ?)';
        pool.query(query, [productName, categoryId, price, userId], (err, result) => {
            if (err) {
                console.error('Error adding product: ', err);
                res.status(500).send('Error adding product');
            } else {
                res.status(201).send('New poduct added successfully');
            }
        });
    } catch (err) {
        console.error('Error adding product: ', err);
        res.status(500).send('Error adding product');
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

const addProductVariations = async (req, res) => {

    const products = req.body.products;
    const userId = req.userId;
    const currentTime = moment().tz('Asia/Jakarta').format('YYYY-MM-DD HH:mm:ss');

    // Mendapatkan koneksi dari poolPromise
    const connection = await poolPromise;
    try {

        // Memulai transaksi
        await new Promise((resolve, reject) => {
            connection.query('BEGIN TRANSACTION', (err) => {
                if (err) return reject(err);
                resolve();
            });
        });

        const query = 'INSERT INTO product_variations (product_id, price, stock, created_at, created_by) VALUES (?, ?, ?, ?, ?)';

        for (const product of products) {
            const { id, price, quantity } = product;
            const values = [id, price, quantity, currentTime, userId];

            await new Promise((resolve, reject) => {
                connection.query(query, values, (err) => {
                    if (err) return reject(err);
                    resolve();
                });
            });
        }

        // Commit transaksi
        await new Promise((resolve, reject) => {
            connection.query('COMMIT', (err) => {
                if (err) return reject(err);
                resolve();
            });
        });

        res.status(201).send('New product variations added successfully');
    } catch (err) {
        // Rollback transaksi jika terjadi kesalahan
        await new Promise((resolve, reject) => {
            connection.query('ROLLBACK', (err) => {
                if (err) return reject(err);
                resolve();
            });
        });

        console.error('Error adding product variations: ', err);
        res.status(500).send('Error adding product variations');
    }
};

module.exports = {
    getProduct,
    addProduct,
    updateProduct,
    deleteProduct,
    addProductVariations
};
