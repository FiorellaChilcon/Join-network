import React, { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import userAvatar from '../assets/images/user-avatar.svg';

export default function CreatePost() {
  const navigate = useNavigate();
  const { currentUser, userName, addPost, addToastMessage } = useAuth();
  const [content, setContent]= useState('');
  const [privacy, setPrivacy]= useState('public');
  const [isLoading, setIsLoading]= useState('');

  const isDisabled = useMemo(() => {
    return !content.trim() || isLoading;
  }, [isLoading, content]);

  const handleContentChange = ({ target }) => {
    setContent(target.value);
  }

  const handlePrivacyChange = ({ target }) => {
    setPrivacy(target.value);
  }

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      await addPost(content, privacy);
      addToastMessage('Your post was published successfully', 'success');
      return navigate('/');
    } catch (error) {
      addToastMessage(error.message, 'error');
    }
    setIsLoading(false);
  }

  return (
    <div className='create-post-container'>
      <div className='create-post'>
        <div className='create-post-head-wrapper'>
          <div className='user-pic-container'>
            <img className='fit-img' src={currentUser.photoURL || userAvatar} alt='user'/>
          </div>
          <div className='create-header'>
            <span>{userName}</span>
            <select onChange={handlePrivacyChange}>
              <option value='public'>public</option>
              <option value='private'>private</option>
            </select>
          </div>
        </div>
        <textarea
          onChange={handleContentChange}
          placeholder={`Whats on your mind?, ${userName}`}
        >
        </textarea>
        <button
          onClick={handleSubmit}
          disabled={isDisabled}
        >
          {isLoading ? 'Loading...' : 'Post'}
        </button>
      </div>
    </div>
  )
}
