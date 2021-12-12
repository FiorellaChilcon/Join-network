import React, { useState, useEffect } from 'react';
import FlashMessage from '../common/FlashMessage';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useForm } from '../customHooks/useForm';
import { NavLink } from 'react-router-dom';

export default function SignUp() {
  const navigate = useNavigate()
  const [formValues, setFormValues] = useForm({ email: '', password: '' });
  const [isDisabled, setIsDisabled] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { signUp } = useAuth();

  useEffect(() => {
    const disable = !formValues.email || !formValues.password || isLoading;
    setIsDisabled(disable);
    return () => { setIsDisabled(disable); };
  }, [formValues, isLoading]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formValues.email && formValues.password) {
      setIsLoading(true)
      try {
        await signUp(formValues.email, formValues.password);
        setIsLoading(false)
        return navigate('/');
      } catch(error) {
        setErrorMessage({ message: error.message, date: Date.now(), type: 'error' });
        setIsLoading(false)
      }
    }
  }

  const removeErrorMessage = () => {
    setErrorMessage(null);
  }

  return (
    <div className='sign-container'>
      <h1 className='sign-title'>Sign Up</h1>
      <form className='sign-form' onSubmit={handleSubmit}>
        <input
          autoComplete='username'
          placeholder='Email'
          type='email'
          name='email'
          value={formValues.email}
          onChange={setFormValues}
          disabled={isLoading}
        />
        <input
          autoComplete='new-password'
          placeholder='Password'
          type='password'
          name='password'
          value={formValues.password}
          onChange={setFormValues}
          disabled={isLoading}
        />
        <input
          type='submit'
          value={isLoading ? 'Loading...' : 'Sign up'}
          disabled={isDisabled}
        />
      </form>
      <div className='font-small'>
        Have an account? <NavLink to='/sign-in'>Log in</NavLink>
      </div>
      { errorMessage && 
        <FlashMessage
          flashMessage={errorMessage}
          removeFlashMessage={removeErrorMessage}
        />
      }
    </div>
  );
}
