import React, { useState, useEffect } from 'react';
import FlashMessage from '../common/FlashMessage';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function SignUp() {
  const navigate = useNavigate()
  const [isDisabled, setIsDisabled] = useState(true);
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { signUp } = useAuth();

  useEffect(() => {
    const disable = !email || !password || isLoading;
    setIsDisabled(disable);
    return () => { setIsDisabled(disable); };
  }, [email, password, isLoading]);

  const handleChangeEmail = ({ target }) => {
    setEmail(target.value);
  }

  const handleChangePassword = ({ target }) => {
    setPassword(target.value);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (email && password) {
      setIsLoading(true)
      try {
        await signUp(email, password);
        setIsLoading(false)
        return navigate('/');
      } catch(error) {
        setErrorMessage({ message: error.message, date: Date.now() });
        setIsLoading(false)
      }
    }
  }

  const removeErrorMessage = () => {
    setErrorMessage(null);
  }

  return (
    <div>
      <h1 className='sign-title'>Sign Up</h1>
      <form className='sign-form' onSubmit={handleSubmit}>
        <input
          autoComplete='username'
          placeholder='Email'
          type='email'
          onChange={handleChangeEmail}
          disabled={isLoading}
        />
        <input
          autoComplete='new-password'
          placeholder='Password'
          type='password'
          onChange={handleChangePassword}
          disabled={isLoading}
        />
        <input
          type='submit'
          value={isLoading ? 'Loading...' : 'Sign up'}
          disabled={isDisabled}
        />
      </form>
      { errorMessage && 
        <FlashMessage
          type='error'
          flashMessage={errorMessage}
          removeFlashMessage={removeErrorMessage}
        />
      }
    </div>
  );
}
