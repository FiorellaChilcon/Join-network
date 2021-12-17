import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useForm } from '../../customHooks/useForm';

export default function EditProfile(props) {
  const { updateAccount, updateUserEmail, updateUser, currentUser, addToastMessage } = useAuth();
  const initialValues = useCallback(() => {
    return  { displayName: (currentUser.displayName || ''), email: currentUser.email };
  }, [currentUser]);
  const [formValues, setFormValues] = useForm(initialValues);
  const [isDisabled, setIsDisabled] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const initialObj = initialValues();
    const formHasChanges = Object.keys(initialObj).some((field) => {
      return formValues[field].trim() && formValues[field].trim() !== initialObj[field];
    });
    const disable = !formHasChanges || isLoading;
    setIsDisabled(disable);
    return () => { setIsDisabled(disable); };
  }, [formValues, isLoading, initialValues]);


  const _fieldHasChanges = (field) => {
    const initialObj = initialValues();
    return formValues[field].trim() && formValues[field].trim() !== initialObj[field];
  }

  const handleFormValuesSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true)
    try {
      await _updateUser();
      await _updateUserAccount();
      await _updateUserEmail();
      addToastMessage('Your changes were saved!', 'success');
    } catch(error) {
      addToastMessage(error.message, 'error');
    }
    setIsLoading(false);
  }

  const _updateUser = () => {
    const changes = {};
    if (_fieldHasChanges('displayName')) {
      changes.displayName = formValues.displayName.trim();
    }

    if (_fieldHasChanges('email')) {
      changes.displayName = formValues.email.trim();
    }

    return updateUser(changes);
  };

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
