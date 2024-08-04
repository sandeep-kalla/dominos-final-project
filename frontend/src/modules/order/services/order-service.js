import axios from 'axios';

export const orderService = async (email, paymentid, status, name, address, total) => {
  const savedUser = JSON.parse(localStorage.getItem('user'));
  const uid = savedUser?.uid; // Retrieve UID from local storage

  if (!uid) {
    throw new Error('User not logged in');
  }

  const order = { uid, email, paymentid, status, name, address, total };
  const URL = import.meta.env.VITE_ORDER_URL;

  try {
    const response = await axios.post(URL, order);
    console.log('Order Book ', response.data);
    return response.data;
  } catch (error) {
    console.error('Error adding order:', error);
    throw error;
  }
};