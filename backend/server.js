const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const session = require('express-session');
const authRoutes = require('./routes/authRoutes');
const orderRoutes = require('./routes/orderRoutes');
const productRoutes = require('./routes/productRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const verifyToken = require('./middleware/auth');

require('dotenv').config();

const app = express();

// Middleware
app.use(cors()); // Mengaktifkan CORS untuk semua domain
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Session Middleware
app.use(session({
  secret: process.env.SECRET_KEY,
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // set to true if using HTTPS
}));

// Routes
const baseURL = '/express-api';
app.use(baseURL + '/auth', authRoutes);
app.use(baseURL + '/orders', verifyToken, orderRoutes);
app.use(baseURL + '/product', verifyToken, productRoutes);
app.use(baseURL + '/category', verifyToken, categoryRoutes);

const PORT = process.env.PORT || 3005;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
