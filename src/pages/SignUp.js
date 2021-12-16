import React, { useState, useEffect } from 'react';
import FlashMessage from '../common/FlashMessage';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useForm } from '../customHooks/useForm';
import { NavLink } from 'react-router-dom';
import SignInWithProvider from '../components/Sign/SignInWithProvider';

export default function SignUp() {
  const navigate = useNavigate()
  const [formValues, setFormValues] = useForm({ email: '', password: '' });
  const [isDisabled, setIsDisabled] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { signUp, saveUser } = useAuth();

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
        const newUser = await signUp(formValues.email, formValues.password);
        await saveUser(formValues.email, newUser.user.uid);
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
      <span className='font-small'>or</span>
      <SignInWithProvider onAddErrorMessage={addErrorMessage}/>
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
