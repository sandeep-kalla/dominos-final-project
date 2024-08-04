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
import './styles/dashboard.css';

export const DashBoard = () => {
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [recommendedProducts, setRecommendedProducts] = useState([]); // State for recommended products
  const [carts, setCarts] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [address, setAddress] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      await getProducts(); // Fetch products
      await fetchCartData(); // Fetch cart data
      const savedUser = JSON.parse(localStorage.getItem('user')); // Check if user is logged in
      if (savedUser && savedUser.uid) {
        await fetchRecommendedProducts(savedUser.uid); // Fetch personalized recommendations
      } else {
        await fetchRecommendedProducts(); // Fetch general recommendations for non-logged-in users
      }
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
          await fetchRecommendedProducts(savedUser.uid); // Fetch personalized recommendations
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
      }, 1000);
    } catch (error) {
      console.error('Failed to fetch products:', error);
      setLoading(false);
    }
  };

  const fetchRecommendedProducts = async (uid) => {
    let url = `${import.meta.env.VITE_FLASK_API}/recommendations`; // Default URL for non-logged-in users

    // If the UID is provided, append it to the URL
    if (uid) {
      url += `?uid=${uid}`;
    }

    try {
      const response = await axios.get(url); // Fetch recommendations from Python API
      if (response.data) {
        setRecommendedProducts(response.data); // Set recommended products
      } else {
        setRecommendedProducts([]); // Reset recommended products if no data is received
      }
    } catch (error) {
      console.error('Failed to fetch recommended products:', error);
      setRecommendedProducts([]); // Reset recommended products in case of an error
    }
  };

  const handleLogout = () => {
    setCarts([]); // Clear the cart items on logout
    localStorage.removeItem('user'); // Clear user data from localStorage
    fetchRecommendedProducts(); // Fetch general recommendations for non-logged-in users
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

  const saveCartData = async (uid, cartItems) => {
    try {
      await axios.post(`${import.meta.env.VITE_BASE_URL}/carts/${uid}`, { cartItems });
    } catch (error) {
      console.error('Failed to save cart data:', error);
    }
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
          <div className='col-11'>
            <div className='row'>
              {loading ? (
                <Loading setLoading={setLoading} />
              ) : (
                <>
                  {/* Recommended Products Section */}
                  {recommendedProducts.length > 0 && (
                    <div>
                      <h2 className="section-title">Recommended</h2>
                      <Products products={recommendedProducts} />
                    </div>
                  )}
                  {/* Regular Products Section */}
                  <h2 className="section-title">Main Menu</h2>
                  <Products products={searchResults.length ? searchResults : products} />
                </>
              )}
            </div>
          </div>
          <div className='col-1'>
            <CartView address={address} />
          </div>
        </div>
      </CartContext.Provider>
      <ToastContainer position="top-right" autoClose={1500} />
    </div>
  );
};
