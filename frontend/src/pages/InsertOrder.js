import React, { useState } from 'react';
import axios from 'axios';

const InsertOrder = () => {
  const [customerName, setCustomerName] = useState('');
  const [product, setProduct] = useState('');
  const [quantity, setQuantity] = useState('');
  const [price, setPrice] = useState('');  // Tambahkan state untuk price
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3005/orders', {
        customerName,
        product,
        quantity,
        price,  // Sertakan price di body request
      });
      setSuccess('Order added successfully!');
      setCustomerName('');
      setProduct('');
      setQuantity('');
      setPrice('');  // Reset field price setelah berhasil
    } catch (err) {
      setError('Failed to add order');
    }
  };

  return (
    <div className="container mt-5">
      <h2>Insert Order</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="customerName" className="form-label">Customer Name</label>
          <input
            type="text"
            className="form-control"
            id="customerName"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="product" className="form-label">Product</label>
          <input
            type="text"
            className="form-control"
            id="product"
            value={product}
            onChange={(e) => setProduct(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="quantity" className="form-label">Quantity</label>
          <input
            type="number"
            className="form-control"
            id="quantity"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="price" className="form-label">Price</label>
          <input
            type="number"
            className="form-control"
            id="price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
        </div>
        {error && <div className="alert alert-danger">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}
        <button type="submit" className="btn btn-primary">Add Order</button>
      </form>
    </div>
  );
};

export default InsertOrder;
