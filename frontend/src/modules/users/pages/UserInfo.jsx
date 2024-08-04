// UserInfo.jsx
import React from 'react';
import '../styles/userinfo.css';
import { payWithRazorPay } from '../../../shared/services/payment';

export const UserInfo = ({ email, image, name, total, address, closeModal }) => {
  const payNow = () => {
    payWithRazorPay(email, name, total, address, closeModal);
  };

  return (
    <div className="userinfo-container">
      <div className="userinfo-card">
        <img src={image} alt="User" className="userinfo-image" />
        <div className="userinfo-details">
          <h3 className="userinfo-name">{name}</h3>
          <p className="userinfo-email">{email}</p>
          <p className="userinfo-total">Total: ₹ {total}</p>
          <p className="userinfo-address">Address: {address}</p>
        </div>
        <button onClick={payNow} className='btn btn-primary'>PayNow</button>
      </div>
    </div>
  );
};
