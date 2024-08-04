// Navbar.jsx
import './styles/navbar.css';
import { NavLink } from 'react-router-dom';
import VoiceSearch from './VoiceSearch';
import { useState } from 'react';
import SearchBar from './SearchBar';
import GpsLocation from '../components/Gps.jsx';
import OrderHistory from '../components/OrderHistory.jsx';
import { MapPin } from 'lucide-react';

export const Navbar = ({ onSearchResults, onAddressRetrieved }) => {
  const [searchResults, setSearchResults] = useState([]);
  const [showOrderHistory, setShowOrderHistory] = useState(false);

  const handleSearch = async (query) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/search?q=${query}`);
      const results = await response.json();
      setSearchResults(results);
      onSearchResults(results);
    } catch (error) {
      console.error('Error searching:', error);
    }
  };

  const toggleOrderHistory = () => {
    setShowOrderHistory(prevState => !prevState);
  };

  return (
    <nav className='navbar'>
      <ul className='navbar-list'>
        {/* NavLink items */}
      </ul>
      <div className="navbar-actions">
        <div className="location">
          <GpsLocation onAddressRetrieved={onAddressRetrieved} />
        </div>
        <div className="searchbar">
          <SearchBar onSearch={handleSearch} />
          <VoiceSearch onSearch={handleSearch} />
        </div>
        <button className="order-history-button" onClick={toggleOrderHistory}>
          Order History
        </button>
      </div>
      {showOrderHistory && <OrderHistory onClose={toggleOrderHistory} />}
    </nav>
  );
};