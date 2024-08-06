import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import {
  Row,
  Col,
  Card,
  Modal,
  Button,
  InputGroup,
  FormControl
} from "react-bootstrap";
import apiClient from "../utils/axiosConfig";

const RestockPage = () => {
  const [productSelected, setProductSelected] = useState([]);
  const [mainProduct, setMainProduct] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredMainProduct, setFilteredMainProduct] = useState(mainProduct);
  const [clickedProductId, setClickedProductId] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchMainProduct();
    console.log(filteredMainProduct);
  }, []);

  // debug product selected
  useEffect(
    () => {
      console.log(clickedProductId);
    },
    [clickedProductId]
  );

  const fetchMainProduct = async () => {
    try {
      const response = await apiClient.get("/product");
      setMainProduct(response.data);
      setFilteredMainProduct(response.data);
    } catch (error) {
      console.log("Failed to fecth main product, ", error);
    }
  };

  // Handle perubahan input pencarian
  const handleInputSearchChange = e => {
    const term = e.target.value;
    setSearchTerm(term);

    // Filter produk berdasarkan input pencarian
    const filtered = mainProduct.filter(product =>
      product.productName.toLowerCase().includes(term.toLowerCase())
    );

    setFilteredMainProduct(filtered);
  };

  const handleCardClick = async product => {
    try {
      // Copy existing selected products
      const updatingProductSelected = [...productSelected];

      // Find if the product already exists
      const existingProductIndex = updatingProductSelected.findIndex(
        item => item.id === product.id
      );

      if (existingProductIndex !== -1) {
        // If it exists, update the quantity
        updatingProductSelected[existingProductIndex].quantity += 1;
      } else {
        // If it does not exist, add it with a quantity of 1
        const newProductSelected = { ...product, quantity: 1 };
        updatingProductSelected.push(newProductSelected);
      }

      // Update the state
      setProductSelected(updatingProductSelected);

      setClickedProductId(product.id);

      // Remove the clicked effect after 200ms
      setTimeout(() => {
        setClickedProductId(null);
      }, 100);
    } catch (error) {
      console.log("Failed to updating product selected, ", error);
    }
  };

  const handleQuantityChange = (index, newQuantity) => {
    try {
      const updatedProductSelected = productSelected.map(
        (product, i) =>
          i === index ? { ...product, quantity: newQuantity } : product
      );
      setProductSelected(updatedProductSelected);
    } catch (error) {
      console.log("Failed to update quantity, ", error);
    }
  };

  const handleDelete = index => {
    try {
      const updatedProductSelected = productSelected.filter(
        (_, i) => i !== index
      );
      setProductSelected(updatedProductSelected);
    } catch (error) {
      console.log("Failed to delete product selected, ", error);
    }
  };

  const handleConfirm = async () => {
    // const updatingProductSelected = [...productSelected];
    // const existingProductIndex = updatingProductSelected.findIndex(
    //   item => item.id === currentProduct.id
    // );

    // if (existingProductIndex !== -1) {
    //   updatingProductSelected[existingProductIndex].quantity += 1;
    // } else {
    //   const newProductSelected = { ...currentProduct, quantity: 1 };
    //   updatingProductSelected.push(newProductSelected);
    // }

    // setProductSelected(updatingProductSelected);

    // Contoh array produk yang akan dikirim
    const products = productSelected;

    try {
      const response = await apiClient.post("/product/restock/add", {
        products
      });

      if (response.status === 201) {
        Swal.fire({
          icon: "success",
          title: "Berhasil!",
          text: "Produk berhasil ditambahkan."
        });
        setShowModal(false);
        setProductSelected([]);
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Gagal!",
        text: "Gagal menambahkan produk. Coba lagi nanti."
      });
      console.error("Gagal menambahkan produk: ", error);
    }
  };

  const handleCancel = () => {
    setShowModal(false);
    // setCurrentProduct(null);
  };

  return (
    <div className="container mt-2">
      <h4>Restock Page</h4>
      <div className="row">
        <div className="col-md-6">
          <input
            type="text"
            className="form-control mt-2 mb-2"
            placeholder="Search Product ..."
            value={searchTerm}
            onChange={handleInputSearchChange}
          />
          <Row xs={1} md={3} className="g-1">
            {filteredMainProduct.map((product, idx) =>
              <Col key={idx}>
                <Card
                  style={{ cursor: "pointer" }}
                  onClick={() => handleCardClick(product)}
                  className={`${clickedProductId === product.id
                    ? "bg-info"
                    : ""}`}
                >
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
        <div className="col-md-6">
          <Button
            className={`ms-2 float-end ${productSelected.length > 0 ? "d-block" : "d-none"}`}
            variant="primary"
            onClick={() => {
              if (productSelected.length > 0) {
                console.log(productSelected);
                setShowModal(true);
              }
            }}
          >
            Submit
          </Button>
          <Row xs={1} md={1} className="g-2 mt-5">
            {productSelected.map((product, index) =>
              <Col key={index}>
                <Card
                  border="primary"
                  style={{ width: "35rem", cursor: "pointer" }}
                  className={`${clickedProductId === product.id
                    ? "bg-info"
                    : ""}`}
                >
                  <Card.Body className="d-flex justify-content-between align-items-center">
                    <div className="col-md-6">
                      {product.productName}
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
                            handleQuantityChange(index, product.quantity + 1)}
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
      </div>
      <Modal show={showModal} onHide={handleCancel}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Submition</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure to submit this data to the server?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCancel}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleConfirm}>
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default RestockPage;
