import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useForm } from '../../customHooks/useForm';

export default function EditProfile(props) {
  const { onSetNewMessage } = props;
  const { updateAccount, updateUserEmail, currentUser } = useAuth();
  const initialValues = { displayName: (currentUser.displayName || ''), email: currentUser.email }
  const [formValues, setFormValues] = useForm(initialValues);
  const [isDisabled, setIsDisabled] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const disable = !_formHasChanges() || isLoading;
    setIsDisabled(disable);
    return () => { setIsDisabled(disable); };
  }, [formValues, isLoading]);

  const _formHasChanges = () => {
    return Object.keys(initialValues).some((field) => {
      return _fieldHasChanges(field);
    });
  }

  const _fieldHasChanges = (field) => {
    return formValues[field].trim() && formValues[field].trim() !== initialValues[field];
  }

  const handleFormValuesSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true)
    try {
      await _updateUserAccount();
      await _updateUserEmail();
      onSetNewMessage({ message: 'Your changes were saved!', date: Date.now(), type: 'success' });
    } catch(error) {
      onSetNewMessage({ message: error.message, date: Date.now(), type: 'error' });
    }
    setIsLoading(false);
  }

  const _updateUserAccount = () => {
    if (_fieldHasChanges('displayName')) {
      return updateAccount(formValues.displayName.trim());
    }
  }

  const _updateUserEmail = () => {
    if (_fieldHasChanges('email')) {
      return updateUserEmail(formValues.email.trim());
    }
  }

  return (
    <form className='sign-form' onSubmit={handleFormValuesSubmit}>
      <h2>Edit Details</h2>
      <label>Email</label>
      <input
        autoComplete='username'
        placeholder='Your email'
        type='email'
        name='email'
        value={formValues.email}
        onChange={setFormValues}
        disabled={isLoading}
      />
      <label>Name</label>
      <input
        autoComplete='given-name'
        placeholder='Your name'
        type='text'
        name='displayName'
        value={formValues.displayName}
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
