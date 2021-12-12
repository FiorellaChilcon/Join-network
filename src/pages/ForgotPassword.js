import React, { useEffect, useState } from 'react';
import FlashMessage from '../common/FlashMessage';
import { useForm } from '../customHooks/useForm';
import { useAuth } from '../contexts/AuthContext';
import { NavLink } from 'react-router-dom';

export default function ForgotPassword() {
  const [formValues, setFormValues] = useForm({ email: '' });
  const [isDisabled, setIsDisabled] = useState(true);
  const [reqMessage, setReqMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { resetPassword } = useAuth();

  useEffect(() => {
    const disable = !formValues.email || isLoading;
    setIsDisabled(disable);
    return () => { setIsDisabled(disable); };
  }, [formValues, isLoading]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formValues.email) {
      setIsLoading(true)
      try {
        await resetPassword(formValues.email);
        setIsLoading(false);
        setReqMessage({ message: "we've send you an email", date: Date.now(), type: 'success' });
      } catch(error) {
        setReqMessage({ message: error.message, date: Date.now(), type: 'error' });
        setIsLoading(false)
      }
    }
  }

  const removeMessage = () => {
    setReqMessage(null);
  }

  return (
    <div className='forgot-password-container'>
      <h1 className='sign-title'>Forgot your password?</h1>
      <div className='instructions'>Enter your email, phone, or username and we'll send you a link to get back into your account.</div>
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
          type='submit'
          value={isLoading ? 'Loading...' : 'Submit'}
          disabled={isDisabled}
        />
      </form>
      <NavLink to='/sign-in'>Back to Login</NavLink>
      { reqMessage && 
        <FlashMessage
          flashMessage={reqMessage}
          removeFlashMessage={removeMessage}
        />
      }
    </div>
  )
}
