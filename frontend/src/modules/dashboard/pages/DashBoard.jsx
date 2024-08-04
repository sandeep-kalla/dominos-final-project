import React, { useEffect, useState } from 'react';
import { Products } from '../components/Products';
import { Header } from '../../../shared/components/Header';
import { getApi } from '../../../shared/services/api-client';
import { CartView } from '../../carts/pages/CartView';
import { CartContext } from '../context/cart-context';
import { Navbar } from '../../../shared/components/NavBar';
import Loading from "../../../shared/widgets/Loading";
import { ToastContainer, toast } from 'react-toastify';
import axios from 'axios';
import 'react-toastify/dist/ReactToastify.css';

export const DashBoard = () => {
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [carts, setCarts] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [address, setAddress] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      await getProducts(); // Fetch products
      await fetchCartData(); // Fetch cart data
    };

    fetchData();
  }, []);

  const fetchCartData = async () => {
    const savedUser = JSON.parse(localStorage.getItem('user'));
    if (savedUser) {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/carts/${savedUser.uid}`);
        if (response.data && response.data.cartItems) {
          setCarts(response.data.cartItems);
        }
      } catch (error) {
        console.error('Failed to fetch cart data:', error);
      }
    }
  };

  const getProducts = async () => {
    try {
      // Simulate a delay for the loading bar
      await new Promise(resolve => setTimeout(resolve, 1000)); // 1 second delay
      const data = await getApi();
      console.log('Products ', data);
      setTimeout(() => {
        setProducts(data);
        setLoading(false);
      },1000);
    } catch (error) {
      console.error('Failed to fetch products:', error);
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setCarts([]); // Clear the cart items on logout
    localStorage.removeItem('user'); // Optionally clear user data from localStorage
  };

  const addCart = async (product) => {
  const existingItem = carts.find((item) => item.id === product.id);
  const savedUser = JSON.parse(localStorage.getItem('user'));
  let updatedCartItems;

  if (existingItem) {
    // If the item already exists in the cart, update its quantity
    updatedCartItems = carts.map((item) => {
      if (item.id === product.id) {
        const newQuantity = item.quantity + 1; // Increment quantity
        const newPrice = (parseFloat(item.basePrice) * newQuantity).toFixed(2); // Calculate new price based on base price
        return { ...item, quantity: newQuantity, price: newPrice }; // Update item
      }
      return item; // Return unchanged item
    });
  } else {
    // If the item does not exist, add it to the cart with quantity 1
    updatedCartItems = [...carts, { ...product, quantity: 1, basePrice: product.price, price: product.price }];
  }

  setCarts(updatedCartItems);
  await saveCartData(savedUser.uid, updatedCartItems); // Save updated cart data
  toast.success('Pizza added to cart!');
};

  const removeCart = async (productId) => {
    const existingItem = carts.find((item) => item.id === productId);
    const savedUser = JSON.parse(localStorage.getItem('user'));
    
    if (existingItem) {
      const productPrice = parseFloat(existingItem.price) / existingItem.quantity;
      const updatedCartItems = carts
        .map((item) => {
          if (item.id === productId) {
            const updatedPrice = (parseFloat(item.price) - productPrice).toFixed(2);
            return { ...item, quantity: item.quantity - 1, price: updatedPrice };
          }
          return item;
        })
        .filter((item) => item.quantity > 0);

      setCarts(updatedCartItems);
      await saveCartData(savedUser.uid, updatedCartItems); // Save updated cart data
      toast.info('Pizza removed from cart!');
    }
  };

  return (
    <div>
      <Header onLogout={handleLogout} onLogin={fetchCartData} />
      <Navbar onSearchResults={setSearchResults} onAddressRetrieved={setAddress} />
      <CartContext.Provider value={{ carts: carts, addCart: addCart, removeCart: removeCart }}>
        <div className='row'>
          <div className=''>
            <div className='row'>
              {loading ? (
                <Loading setLoading={setLoading} />
              ) : (
                <Products products={searchResults.length ? searchResults : products} />
              )}
            </div>
          </div>
          <div className=''>
            <CartView address={address} />
          </div>
        </div>
      </CartContext.Provider>
      <ToastContainer position="top-right" autoClose={1500} />
    </div>
  );
};
