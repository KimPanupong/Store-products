import React from "react";
import "./card.css";

function Card({ products, onDelete, onEdit }) {
  return (
    <div className="product-container">
      {products.map((product) => (
        <div key={product.id} className="product-card">
          <p> {product.category}</p>
          <img src={product.image} alt={product.title} />
          <div className="pro-tittle">
            <h2>{product.title}</h2>
          </div>
          <p>Price: ${product.price}</p>
          {product.isAdded && (
            <div className="content-button">
              <button
                className="btn btn-dark"
                onClick={() => onDelete(product.id)}
              >
                Delete
              </button>
              <button
                className="btn btn-dark"
                onClick={() => onEdit(product.id)}
              >
                Edit
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default Card;
