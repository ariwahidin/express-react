import React, { useState, useEffect, useContext } from "react";
import apiClient from "../utils/axiosConfig";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Select from "react-select";
import Card from "react-bootstrap/Card";
import Table from "react-bootstrap/Table";
import CardGroup from "react-bootstrap/CardGroup";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";

import { InputGroup, FormControl } from "react-bootstrap";

const OrderPage = () => {
  const [orders, setOrders] = useState([]);
  const [customerName, setCustomerName] = useState("");
  const [product, setProduct] = useState(null);
  const [products, setProducts] = useState([]);
  const [quantity, setQuantity] = useState("");
  const [price, setPrice] = useState("");
  const [totalPrice, setTotalPrice] = useState(0);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [editOrderId, setEditOrderId] = useState(null);
  const [modalShow, setModalShow] = useState(false);
  const [modalContent, setModalContent] = useState({});

  const [modalProductShow, setModalProductShow] = useState(false);

  const [productss, setProductss] = useState([
    { id: 1, productName: "Product 1", price: 1000, quantity: 1 },
    { id: 2, productName: "Product 2", price: 2000, quantity: 1 },
    { id: 3, productName: "Product 3", price: 3000, quantity: 1 }
  ]);

  const handleQuantityChange = (index, newQuantity) => {
    try {
      // Membuat salinan dari orders dan memperbarui quantity pesanan pada index yang sesuai
      const updatedOrders = orders.map(
        (order, i) =>
          i === index ? { ...order, quantity: newQuantity } : order
      );

      // Memperbarui state orders dengan daftar yang telah diperbarui
      setOrders(updatedOrders);
    } catch (error) {
      console.log("Failed to update quantity, ", error);
    }
  };

  const hanldeModalProductShow = () => {
    setModalProductShow(true);
  };

  const handleModalProductClose = () => {
    setModalProductShow(false);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Fetch orders on component mount
  const fetchOrders = async () => {
    try {
      const response = await apiClient.get("/orders");
      setOrders(response.data);
      let order = response.data;
      let totalBelanja = 0;
      order.forEach(ord => {
        let hargaPerItem = ord.price;
        let qtyPerItem = ord.quantity;
        let totalHargaPerItem = hargaPerItem * qtyPerItem;
        totalBelanja += totalHargaPerItem;
      });
      setTotalPrice(totalBelanja);
    } catch (err) {
      console.error("Failed to fetch orders", err);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await apiClient.get("/product");
      setProducts(response.data);
    } catch (error) {
      console.log("Failed to fecth products", error);
    }
  };

  const handleSelectChange = selOpt => {
    setProduct(selOpt.value);
    setPrice(selOpt.price);
  };

  const handleModalShow = order => {
    setModalShow(true);
    setModalContent(order);
    console.log(order);
  };

  const handleModalClose = () => {
    setModalShow(false);
  };

  const handleCardClick = async product => {
    try {
      const newOrder = {
        customerName: "Cust 1",
        quantity: 1,
        product: product.productName,
        price: product.price
      };

      // Buat salinan orders dan tambahkan newOrder
      const updatedOrders = [...orders, newOrder];

      // Perbarui state orders
      setOrders(updatedOrders);
      console.log(updatedOrders);
    } catch (error) {
      console.log("Failed to submit order, ", error);
    }
  };

  const handleEdit = order => {
    setCustomerName(order.customerName);
    setProduct(order.product);
    setQuantity(order.quantity);
    setPrice(order.price);
    setEditOrderId(order.id);
  };

  const handleDelete = index => {
    try {
      // Membuat salinan dari orders dan menghapus item pada index yang sesuai
      const updatedOrders = orders.filter((_, i) => i !== index);

      // Memperbarui state orders dengan daftar yang telah diperbarui
      setOrders(updatedOrders);
    } catch (error) {
      console.log("Failed to delete order, ", error);
    }
  };

  const calculateTotal = () => {
    return orders.reduce((total, order) => total + (order.price * order.quantity), 0);
  };


  const showDetailOrder = async order => {
    console.log(order);
  };

  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col-md-6">
          <Button variant="primary">Food</Button>{" "}
          <Button variant="secondary">Baverage</Button>{" "}
          <Button variant="success">Coffe</Button>{" "}
          <Button variant="warning">Candy</Button>{" "}
          <Button variant="primary">All Menu</Button>{" "}
          <input
            type="text"
            className="form-control mt-2 mb-2"
            placeholder="Search Menu ..."
          />
          <Row xs={1} md={3} className="g-1">
            {products.map((product, idx) =>
              <Col key={idx}>
                <Card onClick={() => handleCardClick(product)}>
                  {/* <Card.Img variant="top" src="holder.js/100px160" /> */}
                  <Card.Body>
                    <Card.Title>
                      {product.productName}
                    </Card.Title>
                    <Card.Text>
                      {product.price}
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            )}
          </Row>
        </div>

        {/* Daftar Order */}
        <div className="col-md-6">
          <Button
            className="ms-2 float-end"
            variant="success"
            onClick={() => {
              console.log(orders);
            }}
          >
            Check Out
          </Button>
          <h2 className="float-end">
            {calculateTotal().toLocaleString()}
          </h2>

          <Row xs={1} md={1} className="g-2 mt-5">
            {orders.map((product, index) =>
              <Col key={index}>
                <Card border="primary" style={{ width: "35rem"}}>
                  <Card.Body className="d-flex justify-content-between align-items-center">
                    <div className="col-md-6">
                      {product.product}
                      <br />
                      <span>
                        Rp.{product.price}
                      </span>
                    </div>
                    <div className="col-md-5">
                      <InputGroup
                        className="float-end"
                        style={{ maxWidth: "150px" }}
                      >
                        <Button
                          variant="outline-secondary"
                          onClick={() =>
                            handleQuantityChange(
                              index,
                              Math.max(1, product.quantity - 1)
                            )}
                        >
                          -
                        </Button>
                        <FormControl
                          type="number"
                          value={product.quantity}
                          onChange={e =>
                            handleQuantityChange(
                              index,
                              Math.max(1, parseInt(e.target.value, 10))
                            )}
                          min="1"
                          className="text-center"
                        />
                        <Button
                          variant="outline-secondary"
                          onClick={() =>
                            handleQuantityChange(
                              index,
                              product.quantity + 1
                            )}
                        >
                          +
                        </Button>
                      </InputGroup>
                      
                    </div>
                    <div className="col-md-1">
                      <Button
                        variant="outline-danger"
                        onClick={() => handleDelete(index)}
                        className="ms-2 float-end"
                      >
                        x
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            )}
          </Row>
        </div>

        <Modal show={modalShow} onHide={handleModalClose} size="lg">
          <Modal.Header closeButton>
            <Modal.Title>Order List</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {/* Tabel di dalam Modal */}
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Customer Name</th>
                  <th>Product</th>
                  <th>Quantity</th>
                  <th>Price</th>
                </tr>
              </thead>
              <tbody>
                <tr key={modalContent.id}>
                  <td>
                    {modalContent.id}
                  </td>
                  <td>
                    {modalContent.customerName}
                  </td>
                  <td>
                    {modalContent.product}
                  </td>
                  <td>
                    {modalContent.quantity}
                  </td>
                  <td>
                    {modalContent.price}
                  </td>
                </tr>
              </tbody>
            </table>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleModalClose}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>

        <Modal
          show={modalProductShow}
          onHide={handleModalProductClose}
          size="lg"
        >
          <Modal.Header closeButton>
            <Modal.Title>All Menu</Modal.Title>
          </Modal.Header>
          <Modal.Body className="w-100 gap-1" />

          {/* <Row xs={1} md={3} className="g-4">
            {products.map(product =>
              <Col key={product.id}>
                <Card>
                  <Card.Body>
                    <Card.Title>
                      {product.productName}
                    </Card.Title>
                    <Card.Text>
                      Harga: {product.price}
                    </Card.Text>
                    <InputGroup className="mb-3" style={{ maxWidth: "200px" }}>
                      <Button
                        variant="outline-secondary"
                        onClick={() =>
                          handleQuantityChange(
                            product.id,
                            Math.max(1, product.quantity - 1)
                          )}
                      >
                        -
                      </Button>
                      <FormControl
                        type="number"
                        value={product.quantity}
                        onChange={e =>
                          handleQuantityChange(
                            product.id,
                            Math.max(1, parseInt(e.target.value, 10))
                          )}
                        min="1"
                      />
                      <Button
                        variant="outline-secondary"
                        onClick={() =>
                          handleQuantityChange(
                            product.id,
                            product.quantity + 1
                          )}
                      >
                        +
                      </Button>
                    </InputGroup>
                  </Card.Body>
                </Card>
              </Col>
            )}
          </Row> */}

          <Modal.Footer>
            <Button variant="secondary" onClick={handleModalProductClose}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
};

export default OrderPage;
