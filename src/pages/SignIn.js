import React, { useState, useEffect } from 'react';
import FlashMessage from '../common/FlashMessage';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useForm } from '../customHooks/useForm';
import { NavLink } from 'react-router-dom';
import SignInWithProvider from '../components/Sign/SignInWithProvider';

export default function SignIn() {
  const navigate = useNavigate()
  const [formValues, setFormValues] = useForm({ email: '', password: '' });
  const [isDisabled, setIsDisabled] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { logIn } = useAuth();

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
        await logIn(formValues.email, formValues.password);
        setIsLoading(false)
        return navigate('/');
      } catch(error) {
        addErrorMessage(error.message);
        setIsLoading(false)
      }
    }
  }

  const addErrorMessage = (message) => {
    setErrorMessage({ message, date: Date.now(), type: 'error' });
  }

  const removeErrorMessage = () => {
    setErrorMessage(null);
  }

  return (
    <div className='sign-container'>
      <h1 className='sign-title'>Sign In</h1>
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
          autoComplete='current-password'
          placeholder='Password'
          type='password'
          name='password'
          value={formValues.password}
          onChange={setFormValues}
          disabled={isLoading}
        />
        <input
          type='submit'
          value={isLoading ? 'Loading...' : 'Sign in'}
          disabled={isDisabled}
        />
      </form>
      <span className='font-small'>or</span>
      <SignInWithProvider onAddErrorMessage={addErrorMessage}/>
      <NavLink to='/forgot-password'>Forgot your password?</NavLink>
      <div className='font-small'>
        Don't have an account? <NavLink to='/sign-up'>Sign up</NavLink>
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
