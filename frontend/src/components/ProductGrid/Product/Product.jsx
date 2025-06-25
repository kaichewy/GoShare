import React from 'react';
import './Product.css';

const Product = ({ product }) => {
  return (
    <div className="product-card">
      <img 
        src={product.image} 
        alt={product.name} 
        className="product-image" 
      />
      <div className="product-details">
        
        <h3 className="product-name">{product.name}</h3>
        <div className="product-rating">
          <span></span>
          <span>⭐ {product.rating}</span>
          <span className="product-reviews">({product.reviews} Reviews)</span>
        </div>

        <div className="product-progress">
          <p className="progress-label">
            {product.bought} out of {product.total} sold
          </p>
            <div className="progress-background">
              <div 
                className="progress-fill" 
                style={{ width: `${(product.bought / product.total) * 100}%` }}
              ></div>
            </div>
        </div>

        <div className="product-footer">
          <p className="product-price">${product.price}</p>
          <button className="add-button">Join ShareBuy</button>
        </div>
      </div>
    </div>
  );
};

export default Product;