import React, { useState } from 'react'
import { useAuth } from '../../contexts/AuthContext';
import userAvatar from '../../assets/images/user-avatar.svg';

export default function Comments(props) {
  const { post } = props;
  const { currentUser, addComment } = useAuth();
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (content.trim()) {
      setLoading(true)
      await addComment(post.id, content.trim())
      setContent('');
      setLoading(false)
    }
  }

  const handleContentChange = ({ target }) => {
    setContent(target.value);
  }


  return (
    <div className='comments-container'>
      <form onSubmit={handleSubmitComment}>
        <div className='pic-container'>
          <img className='fit-img' src={currentUser.photoURL || userAvatar} alt='user'/>
        </div>
        <input
          value={loading ? 'submitting...' : content}
          disabled={loading}
          onChange={handleContentChange}
          placeholder='leave a comment...' type='text'
        />
      </form>
    </div>
  )
}
