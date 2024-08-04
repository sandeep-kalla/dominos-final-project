import React, { useContext } from 'react';
import './styles/cart.css';
import { CartContext } from '../../dashboard/context/cart-context';
import { Pay } from '../../payment/components/Pay';

export const Cart = ({ address }) => {
  const ctx = useContext(CartContext);

  const total = () => {
    return ctx.carts.reduce((sum, product) => sum + parseFloat(product.price), 0).toFixed(2);
  };

  const onAddToCart = (product) => {
    const updatedProduct = { ...product, price: product.price }; // ensure price is correctly handled
    ctx.addCart(updatedProduct);
  };

  const onRemoveFromCart = (productId) => {
    ctx.removeCart(productId);
  };

  return (
    <div className='fixed-cart-container'>
      <h2 className="cart-title">Your Cart</h2>
      <p className="total-items">Total Items: {ctx.carts.length}</p>
      <div className="cart-container">
        {ctx.carts.map((item) => (
          <div className="cart-item" key={item.id}>
            <img src={item.assets.menu['0'].url} alt="pizza" className="cart-item-image" />
            <div className="cart-item-details">
              <p className="cart-item-name">{item.name}</p>
              <p className="cart-item-price">₹ {item.price}</p>
            </div>
            <div className="cart-item-controls">
              <button className="quantity-btn" onClick={() => onRemoveFromCart(item.id)}>-</button>
              <p className="quantity">Quantity: {item.quantity}</p>
              <button className="quantity-btn" onClick={() => onAddToCart(item)}>+</button>
            </div>
          </div>
        ))}
      </div>
      <p className="total-bill">Total Bill: ₹ {total()}</p>
      {ctx.carts.length > 0 && <Pay total={total()} address={address}/>}
    </div>
  );
};