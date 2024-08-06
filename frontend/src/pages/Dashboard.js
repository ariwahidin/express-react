import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/auth/login');
          return;
        }

        const response = await axios.get('http://localhost:3005/orders', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        setOrders(response.data);
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };

    fetchOrders();
  }, [navigate]);

  return (
    <div className="container">
      <h1>Dashboard</h1>
      <h2>Orders</h2>
      <table className="table">
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Customer Name</th>
            <th>Product</th>
            <th>Quantity</th>
            <th>Price</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id}>
              <td>{order.id}</td>
              <td>{order.customerName}</td>
              <td>{order.product}</td>
              <td>{order.quantity}</td>
              <td>{order.price}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
