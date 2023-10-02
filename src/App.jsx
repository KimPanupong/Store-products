import React, { useState, useEffect } from "react";
import "./App.css";
import Card from "./components/card/card";
import "bootstrap/dist/css/bootstrap.min.css";
import { Modal, Button } from "react-bootstrap";

function App() {
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const [newProduct, setNewProduct] = useState({
    id: "",
    title: "",
    image: "",
    category: "",
    price: 0,
    isAdded: true,
  });

  const [editProductId, setEditProductId] = useState(null);

  const categories = [...new Set(products.map((product) => product.category))];

  useEffect(() => {
    setTimeout(() => {
      fetch("https://fakestoreapi.com/products")
        .then((response) => response.json())
        .then((data) => {
          const updatedData = data.map((product) => ({
            ...product,
            isAdded: false,
          }));
          setProducts(updatedData);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error loading data:", error);
          setLoading(false);
        });
    }, 1000);
  }, []);

  const handleEditProduct = (id) => {
    const productToEdit = products.find((product) => product.id === id);
    setNewProduct(productToEdit);
    setEditProductId(id);
    setIsEditing(true);
    setShowAddModal(true);
  };

  const handleAddModalShow = () => {
    setIsEditing(false);
    setShowAddModal(true);
  };

  const handleAddModalClose = () => {
    setNewProduct({
      id: "",
      title: "",
      image: "",
      category: "",
      price: 0,
      isAdded: true,
    });
    setEditProductId(null);
    setShowAddModal(false);
  };

  const handleAddProduct = () => {
    if (isEditing) {
      const updatedProducts = products.map((product) => {
        if (product.id === editProductId) {
          return { ...newProduct, id: editProductId };
        }
        return product;
      });
      setProducts(updatedProducts);
    } else {
      const id = 1 + products.length;
      const addedProduct = { ...newProduct, id };
      setProducts([...products, addedProduct]);
    }

    setNewProduct({
      id: "",
      title: "",
      image: "",
      category: "",
      price: 0,
      isAdded: true,
    });

    setEditProductId(null);
    setShowAddModal(false);
  };

  const handleDeleteProduct = (id) => {
    const updatedProducts = products.filter((product) => product.id !== id);
    setProducts(updatedProducts);
  };

  const handleNewProductChange = (e) => {
    const { name, value } = e.target;
    setNewProduct({
      ...newProduct,
      [name]: value,
    });
  };

  const filteredProducts = selectedCategory
    ? products.filter((product) => product.category === selectedCategory)
    : products;

  return (
    <>
      <nav className="navbar-text navbar-dark bg-dark">
        <h1>Store Products</h1>
      </nav>
      <div className="container">
        <div className="category-buttons">
          <button
            onClick={() => setSelectedCategory("")}
            className="btn btn-dark"
          >
            All Categories
          </button>
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className="btn btn-dark"
            >
              {category}
            </button>
          ))}
        </div>
        <button
          className="btn btn-dark product-button"
          onClick={handleAddModalShow}
        >
          Add Product
        </button>
        {loading ? (
          <div className="loading">Loading...</div>
        ) : (
          <div className="product-container">
            <Card
              products={filteredProducts}
              onDelete={handleDeleteProduct}
              onEdit={handleEditProduct}
            />
          </div>
        )}
        <Modal show={showAddModal} onHide={handleAddModalClose}>
          <Modal.Header closeButton>
            <Modal.Title>
              {isEditing ? "Edit Product" : "Add Product"}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <form>
              <div className="form-group">
                <label>Name:</label>
                <input
                  type="text"
                  name="title"
                  value={newProduct.title}
                  onChange={handleNewProductChange}
                  className="form-control"
                />
              </div>
              <div className="form-group">
                <label>Image URL:</label>
                <input
                  type="text"
                  name="image"
                  value={newProduct.image}
                  onChange={handleNewProductChange}
                  className="form-control"
                />
              </div>
              <div className="form-group">
                <label>Category:</label>
                <select
                  name="category"
                  value={newProduct.category}
                  onChange={handleNewProductChange}
                  className="form-control"
                >
                  <option value="">Select Category</option>
                  <option value="men's clothing">men's clothing</option>
                  <option value="jewelery">jewelery</option>
                  <option value="electronics">electronics</option>
                  <option value="women's clothing">women's clothing</option>
                </select>
              </div>
              <div className="form-group">
                <label>Price:</label>
                <input
                  type="number"
                  name="price"
                  value={newProduct.price}
                  onChange={handleNewProductChange}
                  className="form-control"
                />
              </div>
            </form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleAddModalClose}>
              Close
            </Button>
            <Button variant="dark" onClick={handleAddProduct}>
              {isEditing ? "Save Changes" : "Add Product"}
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </>
  );
}

export default App;
