import React, { useState } from 'react';
import FlashMessage from '../common/FlashMessage';
import EditProfile from '../components/EditAccount/EditProfile';
import EditPassword from '../components/EditAccount/EditPassword';

export default function EditAccount() {
  const [reqMessage, setReqMessage] = useState(null);

  const removeMessage = () => {
    setReqMessage(null);
  }

  const setNewMessage = (value) => {
    setReqMessage(value);
  }

  return (
    <div className='sign-container edit-account-container'>
      <h1 className='sign-title'>Account</h1>
      <EditProfile onSetNewMessage={setNewMessage} />
      <EditPassword onSetNewMessage={setNewMessage} />
      { reqMessage && 
        <FlashMessage
          flashMessage={reqMessage}
          removeFlashMessage={removeMessage}
        />
      }
    </div>
  )
}
