import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useForm } from '../../customHooks/useForm';

export default function EditPassword(props) {
  const { onSetNewMessage } = props;
  const { updateUserPassword } = useAuth();
  const [formValues, setFormValues] = useForm({ password: '', confirmPassword: '' });
  const [isDisabled, setIsDisabled] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const disable = !_formHasChanges() || isLoading;
    setIsDisabled(disable);
    return () => { setIsDisabled(disable); };
  }, [formValues, isLoading]);

  const _formHasChanges = () => {
    return formValues.password && formValues.confirmPassword && (formValues.password === formValues.confirmPassword);
  }

  const handleFormValuesSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true)
    try {
      await updateUserPassword(formValues.password);
      onSetNewMessage({ message: 'Your changes were saved!', date: Date.now(), type: 'success' });
    } catch(error) {
      onSetNewMessage({ message: error.message, date: Date.now(), type: 'error' });
    }
    setIsLoading(false);
  }

  return (
    <form className='sign-form' onSubmit={handleFormValuesSubmit}>
      <h2>Change password</h2>
      <label>Password</label>
      <input
        autoComplete='username'
        placeholder='Your new password'
        type='password'
        name='password'
        value={formValues.password}
        onChange={setFormValues}
        disabled={isLoading}
      />
      <label>Confirm password</label>
      <input
        autoComplete='given-name'
        placeholder='Enter again your password'
        type='password'
        name='confirmPassword'
        value={formValues.confirmPassword}
        onChange={setFormValues}
        disabled={isLoading}
      />
      <input
        type='submit'
        value={isLoading ? 'Loading...' : 'Save'}
        disabled={isDisabled}
      />
    </form>
  )
}
