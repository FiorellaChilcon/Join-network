import React, { useEffect, useState, useMemo } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import userAvatar from '../../assets/images/user-avatar.svg';
import privateIcon from '../../assets/images/private.svg';
import publicIcon from '../../assets/images/public.svg';
import heartEmptyIcon from '../../assets/images/heart-empty.svg';
import heartFilledIcon from '../../assets/images/heart-filled.svg';
import menu from '../../assets/images/menu-dots.svg';
import commentIcon from '../../assets/images/comment.svg';
import CommentsContainer from './CommentsContainer';
import ReactTimeAgo from 'react-time-ago';
import { NavLink } from 'react-router-dom';
import useClickOutside from '../../customHooks/useClickOutside';

export default function Post(props) {
  const { doc } = props;
  const post = doc.data();
  const { currentUser, getUserDoc, togglePostLike, getPostComments, removeDoc, addToastMessage, removeCommentsAssociated, removeUserPhotoFromStorage } = useAuth();
  const [userPost, setUserPost] = useState({});
  const [showComments, setShowComments] = useState(false);
  const [comments, setPostComments] = useState([]);
  const [showMenu, setShowMenu] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [postMenu, trigger] = useClickOutside(showMenu, () => { setShowMenu(false) });
  const myPost = post.userId === currentUser.uid;

  const userLikesPost = useMemo(() => {
    return post.likes.includes(currentUser.uid);
  }, [post, currentUser]);

  useEffect(() => {
    const abortController = new AbortController();
    const fetchUser = async () => {
      const resp = await getUserDoc(post.userId);
      setUserPost(resp.data())
    }

    if (myPost) {
      setUserPost(currentUser);
    } else {
      fetchUser();
    }

    return () =>  {
      abortController.abort();
    };
  }, [post, currentUser, getUserDoc, myPost]);

  useEffect(() => {
    const abortController = new AbortController();
    const unsubscribe = getPostComments(doc.id, (querySnapshot) => {
      setPostComments(querySnapshot.docs);
    });
    return () =>  {
      unsubscribe();
      abortController.abort();
    };
  }, [doc, getPostComments]);

  const userName = useMemo(() => {
    const { email, displayName } = userPost;
    return displayName ? displayName : email?.split('@')[0];
  }, [userPost]);

  const privacyIcon = useMemo(() => {
    return post.privacy === 'private' ? privateIcon : publicIcon;
  }, [post]);

  const handleToggleLike = () => {
    togglePostLike(doc.id, !userLikesPost);
  }

  const handleToggleComments = () => {
    setShowComments((prev) => !prev);
  }

  const handleShowMenu = () => {
    setShowMenu((prev) => !prev);
  }

  const handleDeletePost = async () => {
    setIsLoading(true)
    try {
      setShowMenu(false);
      await removeDoc('posts', doc.id);
      removeCommentsAssociated(doc.id);
      if (post.photo) {
        removeUserPhotoFromStorage(post.photoName);
      }
      addToastMessage('Your post was deleted successfully', 'success');
    } catch(error) {
      addToastMessage(error.message, 'error');
    }
    setIsLoading(false);
  }

  return (
    <div className='post'>
      <div className='create-post-head-wrapper'>
        <div className='user-pic-container '>
          <img className='fit-img' src={userPost.photoURL || userAvatar} alt='user'/>
        </div>
        <div className='create-header'>
          <span>{userName}</span>
          <div className='left-bottom-header'>
            <span className='font-grey'>
              <ReactTimeAgo date={post.createdAt} timeStyle='twitter' locale="en-US"/> · 
            </span>
            <img className='privacy-img' src={privacyIcon} alt='privacy'/>
          </div>
        </div>
        {myPost &&
          <div className='menu-container pointer'>
            <button
              className='no-style-btn'
              disabled={isLoading}
              onClick={handleShowMenu}
              ref={trigger}
            >
              <img className='dot-menu' src={menu} alt='post menu'/>
            </button>
            {showMenu &&
              <div className='menu' ref={postMenu}>
                <NavLink className='edit-btn' to={`/post/${doc.id}/edit`}>Edit</NavLink>
                <div className='delete-btn' role='button' onClick={handleDeletePost}>Delete</div>
              </div>}
          </div>
        }
      </div>
      {post.content &&
        <div className='content'>
          <span>{post.content}</span>
        </div>
      }
      {post.photo &&
        <div className='post-photo'>
          <img src={post.photo} alt='post'/>
        </div>
      }
      <div className='interact'>
        <div className='pointer'>
          <img
            onClick={handleToggleLike}
            src={userLikesPost ? heartFilledIcon : heartEmptyIcon}
            alt='like'
          />
          <span className='post-counter'>{post.likes.length}</span>
        </div>
        <div onClick={handleToggleComments} className='pointer'>
          <img src={commentIcon} alt='comment' />
          <span className='post-counter'>{comments.length}</span>
        </div>
      </div>
      {showComments && <CommentsContainer post={doc} comments={comments} />}
    </div>
  )
}
