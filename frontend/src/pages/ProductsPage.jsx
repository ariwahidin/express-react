import { useState, useEffect, useRef } from "react";
import apiClient from "../utils/axiosConfig";
import Select from "react-select";

const ProductPage = () => {
  const [products, setProduct] = useState([]);
  const [category, setCategory] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [productName, setProductName] = useState("");
  const [price, setPrice] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const inputRef = useRef(null);
  const [editProductId, setEditProductId] = useState(null);

  useEffect(() => {
    fetchProduct();
    fetchCategory();
  }, []);

  async function fetchProduct() {
    try {
      const response = await apiClient.get("/product");
      setProduct(response.data);
    } catch (error) {
      console.error("Failed to fetch product, ", error);
    }
  }

  async function fetchCategory() {
    try {
      const response = await apiClient("/category");
      setCategory(response.data);
    } catch (error) {
      console.log("Failed to fecth categories", error);
    }
  }

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      if (editProductId) {
        await apiClient.put(`/product/${editProductId}`, {
          productName,
          price
        });
        setSuccess("Edit product successfully");
      } else {
        await apiClient.post("/product", {
          productName,
          price,
          categoryId : selectedCategory
        });
        setSuccess("Add product successfully");
      }

      // Reset form
      setProductName("");
      setPrice("");
      setEditProductId(null);

      // Fokus ke input setelah submit sukses
      if (inputRef.current) {
        inputRef.current.focus();
      }

      const updatedProduct = await apiClient.get("/product");
      setProduct(updatedProduct.data);
    } catch (error) {
      setError("Failed to add new product");
    }
  };

  const handleDelete = async id => {
    console.log(id);
    try {
      await apiClient.delete(`/product/${id}`);
      setSuccess("Product deleted successfully");

      const updatedProduct = await apiClient("/product");
      setProduct(updatedProduct.data);
    } catch (error) {
      setError("Failed to delete product");
    }
  };

  function handleEdit(product) {
    setProductName(product.productName);
    setPrice(product.price);
    setEditProductId(product.id);
  }

  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col-md-6">
          <h4>
            {"Table Product"}
          </h4>
          <table className="table table-sm table-striped">
            <thead>
              <tr>
                <th>#</th>
                <th>Product Name</th>
                <th>Price</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product, index) =>
                <tr key={product.id}>
                  <td>
                    {index + 1}
                  </td>
                  <td>
                    {product.productName}
                  </td>
                  <td>
                    {product.price}
                  </td>
                  <td>
                    <button
                      className="btn btn-sm btn-info"
                      onClick={() => {
                        handleEdit(product);
                      }}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-sm btn-danger ms-2"
                      onClick={() => {
                        handleDelete(product.id);
                      }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="col-md-6">
          <h4>
            {editProductId ? "Edit Product" : "Add New Product"}
          </h4>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="productName" className="form-label">
                Product Name
              </label>
              <input
                type="text"
                className="form-control"
                id="productName"
                ref={inputRef}
                value={productName}
                onChange={e => setProductName(e.target.value)}
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="Catergory" className="form-label">
                Category
              </label>
              <select className="form-control"
                id="category"
                value={selectedCategory}
                onChange={e => setSelectedCategory(e.target.value)}
                required
              >
                <option value="">--Pilih Kategori--</option>
                {category.map(item =>
                  <option key={item.id} value={item.id}>
                    {item.categoryName}
                  </option>
                )}
              </select>
            </div>

            <div className="mb-3">
              <label htmlFor="price" className="form-label">
                Price
              </label>
              <input
                type="number"
                className="form-control"
                id="price"
                value={price}
                onChange={e => setPrice(e.target.value)}
                required
              />
            </div>
            {error &&
              <div className="alert alert-danger">
                {error}
              </div>}
            {success &&
              <div className="alert alert-success">
                {success}
              </div>}
            <button className="btn btn-primary">
              {editProductId ? "Edit Product" : "Add Product"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
