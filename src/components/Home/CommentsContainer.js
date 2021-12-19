import React, { useState } from 'react'
import { useAuth } from '../../contexts/AuthContext';
import userAvatar from '../../assets/images/user-avatar.svg';
import Comment from './Comment';

export default function CommentsContainer(props) {
  const { post, comments } = props;
  const { currentUser, addComment, addToastMessage } = useAuth();
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (content.trim()) {
      setLoading(true);
      try {
        await addComment(post.id, content.trim())
        setContent('');
        addToastMessage('Your comment was added successfully', 'success');
      } catch (error) {
        addToastMessage(error.message, 'error');
      }
      setLoading(false);
    }
  }

  const handleContentChange = ({ target }) => {
    setContent(target.value);
  }

  return (
    <div className='comments-container'>
      <form className='leave-comment-form' onSubmit={handleSubmitComment}>
        <div className='comment-pic-container'>
          <img className='fit-img' src={currentUser.photoURL || userAvatar} alt='user'/>
        </div>
        <input
          value={loading ? 'submitting...' : content}
          disabled={loading}
          onChange={handleContentChange}
          placeholder='leave a comment...' type='text'
        />
      </form>

      {(comments.length > 0) && <div className='comments'>
        {comments.map(comment =>
          <Comment key={comment.id} comment={comment} />
        )}
      </div>}
    </div>
  )
}
