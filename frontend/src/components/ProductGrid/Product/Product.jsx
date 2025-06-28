import React from 'react';
import './Product.css';
/*
	Name 
	Description 
	Price 
	Quantity -> maybe change to active groups
	Category 
	ImageURL 
*/
const Product = ({ product }) => {
  return (
    <div className="product-card">
      <img 
        src={product.ImageURL} 
        alt={product.Name} 
        className="product-image" 
      />
      <div className="product-details">
        
        <h3 className="product-name">{product.Name}</h3>
        <div className="product-rating">
          <span></span>
          <span>⭐ {product.rating}</span>
          <span className="product-reviews">({product.reviews} Reviews)</span> {/*Need to Implement this In the future */}
        </div>

        {/* <div className="product-progress">
          <p className="progress-label">
            {product.bought} out of {product.total} sold
          </p>
            <div className="progress-background">
              <div 
                className="progress-fill" 
                style={{ width: `${(product.bought / product.total) * 100}%` }}
              ></div>
            </div>
        </div> */} {/* Shift this into the groups section once we make the group card */}

        <div className="product-footer">
          <p className="product-price">${product.Price}</p>
          <button className="add-button">Join ShareBuy</button>
        </div>
      </div>
    </div>
  );
};

export default Product;