import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import userAvatar from '../assets/images/user-avatar.svg';
import useClickOutside from '../customHooks/useClickOutside';

export default function Navbar() {
  const { logOut, currentUser, addToastMessage } = useAuth();
  const [showNavbar, setShowNavbar] = useState(false);
  const navigate = useNavigate();
  const closeMenu = () => {
    setShowNavbar(false);
  };
  const [navbar, trigger] = useClickOutside(showNavbar, closeMenu);
  const toogleNavbar = () => {
    setShowNavbar((prev) => !prev);
  };

  const handleSignOut = async () => {
    try {
      await logOut();
      closeMenu();
      navigate('/sign-in');
    } catch (error) {
      addToastMessage(error.message, 'error');
    }
  };

  return (
    <nav>
      <div className='logo'>
        {currentUser ?
          <NavLink to='/'>
            <img src='logo192.png' alt='go  home'/>
          </NavLink>
          : <div><img src='logo192.png' alt='app logo'/></div>
        }
      </div>
      { currentUser &&
      <div
        role='button'
        className='menu-btn'
        onClick={toogleNavbar}
        ref={trigger}
      >
        <img className='fit-img' src={currentUser.photoURL || userAvatar} alt='go to my profile'/>
      </div>}
      {(currentUser && showNavbar) &&
        <div
          className='menu-links'
          ref={navbar}
        >
          <NavLink to='/' onClick={closeMenu}>Home</NavLink>
          <NavLink to='/me' onClick={closeMenu}>Profile</NavLink>
          <NavLink to='/edit-account' onClick={closeMenu}>Account</NavLink>
          <button onClick={handleSignOut}>Sign Out</button>
        </div>
      }
    </nav>
  );
}
