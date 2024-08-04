import React, { useState, useContext, useEffect } from 'react';
import { Cart } from '../components/Cart';
import { ShoppingCart } from 'lucide-react'; // Import the cart icon
import { CartContext } from '../../dashboard/context/cart-context.js';

export const CartView = ({ address }) => {
  const [showCart, setShowCart] = useState(false); // State to manage cart visibility
  const ctx = useContext(CartContext);

  const toggleCart = () => {
    setShowCart(prevState => !prevState); // Toggle the cart visibility
  };

  return (
    <div className="cart-view">
      <button className="cart-icon-btn" onClick={toggleCart}>
        <ShoppingCart size={24} />
        {ctx.carts.length > 0 && (
          <span className="cart-count">{ctx.carts.length}</span> // Display the cart count
        )}
      </button>
      {showCart && <Cart address={address} />} {/* Render the Cart component conditionally */}
    </div>
  );
};