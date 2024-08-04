import React, { useContext } from 'react';
import { CartContext } from '../context/cart-context';
import './styles/product.css'; // Ensure to include the CSS for styling

export const Product = ({ product }) => {
  const ctx = useContext(CartContext);
  
  const addToCart = () => {
    ctx.addCart({ ...product });
    console.log('Add to Cart Call ', product);
  };

  return (
    <div className="product-card">
      <div className="product-image-container">
        <img src={product.assets.menu['0'].url} className="product-image" alt={product.name} />
      </div>
      <div className="product-details">
        <h5 className="product-title">{product.name}</h5>
        <p className="product-price">₹ {product.price}</p>
        <p className="product-description">{product.menu_description}</p>
        <button onClick={addToCart} className="btn btn-primary add-to-cart-btn">Add to Cart</button>
      </div>
    </div>
  );
};