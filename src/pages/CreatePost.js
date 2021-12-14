import React, { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import userAvatar from '../assets/images/user-avatar.png';
import FlashMessage from '../common/FlashMessage';

export default function CreatePost() {
  const navigate = useNavigate()
  const { currentUser, userName, addPost } = useAuth();
  const [content, setContent]= useState('');
  const [privacy, setPrivacy]= useState('public');
  const [isLoading, setIsLoading]= useState('');
  const [reqMessage, setReqMessage] = useState(null);

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
      const post = await addPost(content, privacy, '');
      console.log(post);
      setReqMessage({ message: 'Your post was published successful', date: Date.now(), type: 'success' });
      navigate('/');
    } catch (error) {
      setReqMessage({ message: error.message, date: Date.now(), type: 'error' });
    }
    setIsLoading(false);
  }

  const removeMessage = () => {
    setReqMessage(null);
  }


  return (
    <div className='create-post-container'>
      <div className='create-post-head-wrapper post-redirect'>
        <div className='user-pic-container'>
          <img src={currentUser.photoURL || userAvatar} alt='user'/>
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
      { reqMessage && 
        <FlashMessage
          flashMessage={reqMessage}
          removeFlashMessage={removeMessage}
        />
      }
    </div>
  )
}
