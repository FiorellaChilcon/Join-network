import React, { useRef, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { isMobile } from 'react-device-detect';
import menuIcon from '../assets/images/bars-solid.svg'
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import FlashMessage from '../common/FlashMessage';

export default function Navbar() {
  const navbar = useRef(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const { logOut, currentUser } = useAuth();
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
      setErrorMessage({ message: error.message, date: Date.now() });
    }
  };

  const removeErrorMessage = () => {
    setErrorMessage(null);
  }

  return (
    <nav>
      <div className="logo">
        {currentUser ?
          <NavLink to='/' onClick={handleClick}>
            <img src='logo192.png' alt='go  home'/>
          </NavLink>
          : <div><img src='logo192.png' alt='app logo'/></div>
        }
      </div>
      <div
        role='button'
        className='menu-btn'
        onClick={toogleNavbar}
      >
        <img src={menuIcon} alt='open menu' />
      </div>
      <div
        className='menu-links'
        ref={navbar}
      >
        {currentUser && <NavLink to='/' onClick={handleClick}>Home</NavLink>}
        {currentUser && <button onClick={handleSignOut}>Sign Out</button>}
        {!currentUser && <NavLink to='/sign-in' onClick={handleClick}>Sign in</NavLink>}
        {!currentUser && <NavLink to='/sign-up' onClick={handleClick}>Sign up</NavLink>}
      </div>
      { errorMessage && 
        <FlashMessage
          type='error'
          flashMessage={errorMessage}
          removeFlashMessage={removeErrorMessage}
        />
      }
    </nav>
  );
}
