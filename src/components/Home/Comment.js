import React, { useEffect, useState, useMemo } from 'react'
import userAvatar from '../../assets/images/user-avatar.svg';
import { useAuth } from '../../contexts/AuthContext';
import ReactTimeAgo from 'react-time-ago';
import menu from '../../assets/images/menu-dots.svg';
import check from '../../assets/images/check.svg';
import close from '../../assets/images/close.svg';

export default function Comment(props) {
  const { comment } = props;
  const data = comment.data();
  const [userComment, setUserComment] = useState({});
  const [commentContent, setCommentContent] = useState(data.content);
  const [editMode, setEditMode] = useState(false);
  const [updatedCommentIsLoading, setUpdatedCommentIsLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { currentUser, getUserDoc, removeDoc, addToastMessage, updateADoc } = useAuth();
  const [showMenu, setShowMenu] = useState(false);
  const myComment = data.userId === currentUser.uid;

  useEffect(() => {
    const abortController = new AbortController();
    const fetchUser = async () => {
      const resp = await getUserDoc(data.userId);
      setUserComment(resp.data())
    }

    if (myComment) {
      setUserComment(currentUser)
    } else {
      fetchUser();
    }

    return () =>  {
      abortController.abort();
    };
  }, []); //eslint-disable-line

  const userName = useMemo(() => {
    const { email, displayName } = userComment;
    return displayName ? displayName : email?.split('@')[0];
  }, [userComment]);

  const handleShowMenu = () => {
    if (!isLoading) {
      setShowMenu((prev) => !prev);
    }
  }

  const handleDeletePost = async () => {
    try {
      setIsLoading(true);
      setShowMenu(false);
      await removeDoc('comments', comment.id);
      addToastMessage('Your comment was deleted successfully', 'success');
    } catch(error) {
      setIsLoading(false);
      addToastMessage(error.message, 'error');
    }
  }

  const handleContentChange = ({ target }) => {
    setCommentContent(target.value);
  }

  const toggleEditMode = () => {
    setCommentContent(data.content);
    setEditMode((prev) => !prev);
    setShowMenu(false);
  }

  const handleUpdateComment = async (e) => {
    e.preventDefault();
    if (data.content === commentContent.trim()) {
      return setEditMode(false);
    }

    if (commentContent.trim() && data.content !== commentContent.trim()) {
      setUpdatedCommentIsLoading(true);
      try {
        await updateADoc('comments', comment.id, { content: commentContent });
        addToastMessage('Your comment was deleted successfully', 'success');
      } catch(error) {
        addToastMessage(error.message, 'error');
      }
      setEditMode(false);
      setUpdatedCommentIsLoading(false);
    }
  }

  const handleCancelChanges = () => {
    setCommentContent(data.content);
    setEditMode(false);
  };

  return (
    <div className='comment'>
      <div className='comment-pic-container'>
        <img className='fit-img' src={userComment.photoURL || userAvatar} alt='user'/>
      </div>
      <div className='content'>
        <div className='flex'>
          <div className='name'>
            {userName}
            <span> · <ReactTimeAgo date={data.createdAt} timeStyle='twitter' locale="en-US"/></span>
          </div>

          {myComment &&
            <div className='menu-container pointer'>
              <button
                className='no-style-btn'
                disabled={isLoading}
                onClick={handleShowMenu}
              >
                <img
                  className='dot-menu'
                  src={menu}
                  alt='post menu'
                />
              </button>
              {showMenu &&
                <div className='menu'>
                  <div className='edit-btn' role='button' onClick={toggleEditMode}>Edit</div>
                  <div className='delete-btn' role='button' onClick={handleDeletePost}>Delete</div>
                </div>}
            </div>
          }
        </div>
        <div className='text'>
        {editMode ?
          <form onSubmit={handleUpdateComment}>
            <input
              autoFocus
              type='text'
              value={updatedCommentIsLoading ? 'updating...' : commentContent}
              onChange={handleContentChange}
              disabled={updatedCommentIsLoading}
            />
          </form> :
          data.content
        }

        {editMode &&
          <div className='cancel-save-options'>
            <button
              className='no-style-btn'
              disabled={updatedCommentIsLoading}
              onClick={handleUpdateComment}
            >
              <img src={check} alt='save comment changes'/>
            </button>
            <button
              className='no-style-btn'
              disabled={updatedCommentIsLoading}
              onClick={handleCancelChanges}
            >
              <img src={close} alt='cancel comment changes'/>
            </button>
          </div>
        }
        </div>
      </div>
    </div>
  )
}
