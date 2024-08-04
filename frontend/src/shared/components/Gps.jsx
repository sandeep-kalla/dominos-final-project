import React, { useState } from 'react';
import { getAddressFromCoordinates } from '../services/gps-serv.js';
import './styles/gps.css';
import { MapPin, MapPinOff } from 'lucide-react'; // Import both icons

function GpsLocation({ onAddressRetrieved }) {
  const [location, setLocation] = useState({ lat: null, lng: null });
  const [error, setError] = useState('');
  const [address, setAddress] = useState('');
  const [showAddress, setShowAddress] = useState(false);

  const getLocation = async () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const newLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setLocation(newLocation);
          setError('');

          try {
            const address = await getAddressFromCoordinates(newLocation.lat, newLocation.lng);
            setAddress(address);
            onAddressRetrieved(address); // Pass address to parent
            setShowAddress(true); // Show address when retrieved
          } catch (error) {
            setError('Error retrieving address: ' + error.message);
          }
        },
        (err) => {
          setError('Error retrieving location: ' + err.message);
        }
      );
    } else {
      setError('Geolocation is not supported by this browser.');
    }
  };

  const toggleAddress = () => {
    setShowAddress(prevState => !prevState); // Toggle the address visibility
  };

  return (
    <div className="gps-container">
      <button className="gps-button" onClick={getLocation}>
        <MapPin size={24} />
      </button>
      {showAddress && (
        <div className="address-container">
          <span className="gps-address">{address}</span>
          <button className="gps-button" onClick={toggleAddress}>
            <MapPinOff size={24} />
          </button>
        </div>
      )}
      {error && <p className="gps-error">{error}</p>}
    </div>
  );
}

export default GpsLocation;