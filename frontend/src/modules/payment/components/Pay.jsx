import React, { useState } from 'react';
import { OAuth } from '../../../shared/services/oauth';
import { UserInfo } from '../../users/pages/UserInfo';
import './styles/pay.css'; // Make sure to include the CSS for modal styling

export const Pay = ({ total, address }) => {
  const [user, setUser] = useState(null);
  const [showUserInfo, setShowUserInfo] = useState(false); // State to manage modal visibility

  const orderNow = async () => {
    const usercred = await OAuth();
    setUser(usercred.user);
    setShowUserInfo(true); // Show UserInfo modal
  };

  const closeModal = () => {
    setShowUserInfo(false); // Close the modal
  };

  return (
    <>
      {!user && <button onClick={orderNow} className='btn btn-primary'>Order Now</button>}
      {user && (
        <>
          <UserInfo total={total} email={user.email} name={user.displayName} image={user.photoURL} address={address} />
          {showUserInfo && (
            <div className="modal-overlay">
              <div className="modal-content">
                <UserInfo total={total} email={user.email} name={user.displayName} image={user.photoURL} address={address} closeModal={closeModal} />
                <button onClick={closeModal} className="btn btn-secondary">Close</button>
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
};