import React, { useRef } from 'react';
import { NavLink } from 'react-router-dom';
import { isMobile } from 'react-device-detect';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import userAvatar from '../assets/images/user-avatar.svg';

export default function Navbar() {
  const navbar = useRef(null);
  const { logOut, currentUser, addToastMessage } = useAuth();
  const navigate = useNavigate()
  const toogleNavbar = () => {
    navbar.current.classList.toggle('flex');
  };

  const handleClick = () => {
    if (isMobile) {
      navbar.current.classList.remove('flex');
    }
  };

  const handleSignOut = async () => {
    try {
      await logOut();
      handleClick();
      navigate('/sign-in');
    } catch (error) {
      addToastMessage(error.message, 'error');
    }
  };

  return (
    <nav>
      <div className='logo'>
        {currentUser ?
          <NavLink to='/' onClick={handleClick}>
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
      >
        <img className='fit-img' src={currentUser.photoURL || userAvatar} alt='go to my profile'/>
      </div>}
      { currentUser &&
      <div
        className='menu-links'
        ref={navbar}
      >
        <NavLink to='/' onClick={handleClick}>Home</NavLink>
        <NavLink to='/me' onClick={handleClick}>Profile</NavLink>
        <NavLink to='/edit-account' onClick={handleClick}>Account</NavLink>
        <button onClick={handleSignOut}>Sign Out</button>
      </div>}
    </nav>
  );
}
