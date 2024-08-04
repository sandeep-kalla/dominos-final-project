import React, { useEffect, useState } from 'react';
import Logo from '../widgets/Logo';
import { Menu } from 'lucide-react';
import { logout, OAuth } from '../services/oauth.js';
import { toast, ToastContainer } from 'react-toastify';
import './styles/header.css';

export const Header = ({ setShowLogin, onLogout, onLogin}) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem('user'));
    if (savedUser) {
      setUser(savedUser);
    } else {
      // Fetch user data from the backend if not found in local storage
      const fetchUser = async () => {
        try {
          const uid = savedUser?.uid; // You need to save UID in localStorage during login
          if (uid) {
            const response = await axios.get(`http://localhost:3000/getUser/${uid}`);
            if (response.data) {
              setUser(response.data);
              localStorage.setItem('user', JSON.stringify(response.data));
            }
          }
        } catch (error) {
          console.error('Failed to fetch user data:', error);
        }
      };
      fetchUser();
    }
  }, []);

  const handleLogin = async () => {
    const usercred = await OAuth();
    setUser(usercred.user);
    localStorage.setItem('user', JSON.stringify(usercred.user));
    onLogin();
    toast.success('Successfully signed up!',{position:"top-center"});
  };

 

  const handleLogout = async () => {
    await logout();
    setUser(null);
    localStorage.removeItem('user');
    onLogout();
    toast.info('Successfully logged out!',{position:"top-center"})
  };



  return (
    <div className="header">
      <div className="left-side">
        <div className="logo">
          <Menu size={28} color="#ffffff" />
          <Logo />
        </div>
      </div>
      <div className="right-side">
        {!user ? (
          <button className="signup-btn" onClick={handleLogin}>Sign Up</button>
        ) : (
          <div className="user-info">
            <img src={user.photoURL} alt={user.displayName} className="user-avatar" />
            <span className="user-name">{user.displayName}</span>
            <button className="signup-btn" onClick={handleLogout}>Logout</button>
          </div>
        )}
      </div>
    </div>
  );
};
