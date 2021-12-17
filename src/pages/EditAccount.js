import React from 'react';
import EditProfile from '../components/EditAccount/EditProfile';
import EditPassword from '../components/EditAccount/EditPassword';

export default function EditAccount() {
  return (
    <div className='sign-container edit-account-container'>
      <h1 className='sign-title'>Account</h1>
      <EditProfile/>
      <EditPassword/>
    </div>
  )
}
