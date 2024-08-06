import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

const Example = () => {
    const [orders, setOrders] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [modalContent, setModalContent] = useState([]);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await axios.get('http://localhost:3005/orders');
                setOrders(response.data);
            } catch (err) {
                console.error('Failed to fetch orders', err);
            }
        };

        fetchOrders();
    }, []);

    const handleShowModal = () => {
        setModalContent(orders);
        setShowModal(true);
    };

    const handleCloseModal = () => setShowModal(false);

    return (
        <div className="container mt-5">
            <Button variant="primary" onClick={handleShowModal}>
                Show Orders in Modal
            </Button>

            {/* Modal */}
            <Modal show={showModal} onHide={handleCloseModal} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Order List</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {/* Tabel di dalam Modal */}
                    <table className="table table-striped">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Customer Name</th>
                                <th>Product</th>
                                <th>Quantity</th>
                                <th>Price</th>
                            </tr>
                        </thead>
                        <tbody>
                            {modalContent.map((order, index) => (
                                <tr key={order.id}>
                                    <td>{index + 1}</td>
                                    <td>{order.customerName}</td>
                                    <td>{order.product}</td>
                                    <td>{order.quantity}</td>
                                    <td>${order.price}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal()}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default Example;