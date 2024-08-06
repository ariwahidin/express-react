const { poolPromise } = require('../config/dbConfig');

// Get Orders
const getOrders = async (req, res) => {
    try {
        const pool = await poolPromise;
        const query = 'SELECT * FROM Orders';
        pool.query(query, (err, result) => {
            if (err) {
                console.error('Error fetching orders: ', err);
                res.status(500).send('Error fetching orders');
            } else {
                res.json(result);
            }
        });
    } catch (err) {
        console.error('Error fetching orders: ', err);
        res.status(500).send('Error fetching orders');
    }
};

// Add Order
const addOrder = async (req, res) => {
    try {
        const { customerName, product, quantity, price } = req.body;
        const pool = await poolPromise;

        const query = `INSERT INTO Orders (customerName, product, quantity, price) VALUES ('${customerName}', '${product}', ${quantity}, ${price})`;
        pool.query(query, (err, result) => {
            if (err) {
                console.error('Error adding order: ', err);
                res.status(500).send('Error adding order');
            } else {
                res.status(201).send('Order added successfully');
            }
        });
    } catch (err) {
        console.error('Error adding order: ', err);
        res.status(500).send('Error adding order');
    }
};

// Update an order
const updateOrder = async (req, res) => {
    try {
        const { id } = req.params;
        const { customerName, product, quantity, price } = req.body;
        const conn = await poolPromise;

        const query = `
        UPDATE Orders
        SET customerName = ?, product = ?, quantity = ?, price = ?
        WHERE id = ?
      `;

        conn.query(query, [customerName, product, quantity, price, id], (err, result) => {
            if (err) {
                console.error('Error updating order: ', err);
                return res.status(500).send('Error updating order');
            }
            res.status(200).send('Order updated successfully');
        });
    } catch (err) {
        console.error('Error updating order: ', err);
        res.status(500).send('Error updating order');
    }
};
// Delete Order
const deleteOrder = async (req, res) => {
    try {
        const { id } = req.params;
        const conn = await poolPromise;

        const query = `
        DELETE FROM Orders
        WHERE id = ?
      `;

        conn.query(query, [id], (err, result) => {
            if (err) {
                console.error('Failed to delete order:', err);
                return res.status(500).json({ error: 'Failed to delete order' });
            }

            if (result.rowsAffected === 0) {
                return res.status(404).json({ error: 'Order not found' });
            }

            res.status(204).send(); // No content response for successful delete
        });
    } catch (err) {
        console.error('Failed to delete order:', err);
        res.status(500).json({ error: 'Failed to delete order' });
    }
};

module.exports = {
    getOrders,
    addOrder,
    updateOrder,
    deleteOrder
};
