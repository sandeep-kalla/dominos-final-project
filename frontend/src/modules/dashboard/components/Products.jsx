import React from 'react';
import { Product } from './Product';
import './styles/products.css'; // Ensure to include the CSS for styling

export const Products = ({ products }) => {
  return (
    <div className="products-container">
      {products.map(product => (
        <Product key={product['_id']} product={product} />
      ))}
    </div>
  );
};