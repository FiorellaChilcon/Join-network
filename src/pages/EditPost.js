import React, { useState, useMemo, useEffect } from 'react'
import { useParams } from "react-router-dom";
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import userAvatar from '../assets/images/user-avatar.svg';

export default function EditPost() {
  const navigate = useNavigate();
  const { postId } = useParams();
  const { currentUser, userName, addToastMessage, updateADoc, getPost } = useAuth();
  const [content, setContent]= useState('');
  const [privacy, setPrivacy]= useState('public');
  const [isLoading, setIsLoading]= useState('');

  useEffect(() => {
    const abortController = new AbortController();
    const fetchPost = async () => {
      const resp = await getPost(postId);
      const post = resp.data();
      setContent(post.content);
      setPrivacy(post.privacy);
    }

    fetchPost();
    return () => {
      abortController.abort();
    };
  }, [getPost, postId]);

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
      await updateADoc('posts', postId, {content, privacy});
      addToastMessage('Your post was updated successfully', 'success');
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
            <select value={privacy} onChange={handlePrivacyChange}>
              <option value='public'>public</option>
              <option value='private'>private</option>
            </select>
          </div>
        </div>
        <textarea
          onChange={handleContentChange}
          placeholder={`Whats on your mind?, ${userName}`}
          value={content}
        >
        </textarea>
        <button
          onClick={handleSubmit}
          disabled={isDisabled}
        >
          {isLoading ? 'Loading...' : 'Save changes'}
        </button>
      </div>
    </div>
  )
}
