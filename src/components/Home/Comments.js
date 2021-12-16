import React from 'react'
import { useAuth } from '../../contexts/AuthContext';
import userAvatar from '../../assets/images/user-avatar.svg';

export default function Comments() {
  const { currentUser } = useAuth();
  return (
    <div className='comments-container'>
      <form>
        <div className='pic-container'>
          <img className='fit-img' src={currentUser.photoURL || userAvatar} alt='user'/>
        </div>
        <input placeholder='leave a comment...' type='text'/>
      </form>
    </div>
  )
}
