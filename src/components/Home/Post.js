import React, { useEffect, useState, useMemo } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import userAvatar from '../../assets/images/user-avatar.svg';
import privateIcon from '../../assets/images/private.svg';
import publicIcon from '../../assets/images/public.svg';
import heartEmptyIcon from '../../assets/images/heart-empty.svg';
import heartFilledIcon from '../../assets/images/heart-filled.svg';
import commentIcon from '../../assets/images/comment.svg';
import Comments from './Comments';

export default function EditProfile(props) {
  const { doc } = props;
  const post = doc.data();
  const { currentUser, getUserDoc, togglePostLike } = useAuth();
  const [userPost, setUserPost] = useState({});
  const [showComments, setShowComments] = useState(false);

  const userLikesPost = useMemo(() => {
    return post.likes.includes(currentUser.uid);
  }, [post, currentUser]);

  useEffect(() => {
    const fetchUser = async () => {
      const resp = await getUserDoc(post.userId);
      setUserPost(resp.data())
    }

    if (post.userId === currentUser.uid) {
      setUserPost(currentUser)
    } else {
      fetchUser();
    }

    return () => {};
  }, [post, currentUser, getUserDoc]);

  const userName = useMemo(() => {
    const { email, displayName } = userPost;
    const char = displayName ? ' ' : '@';
    const field = displayName ? displayName : email;

    return field?.split(char)[0];
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

  return (
    <div className='post'>
      <div className='create-post-head-wrapper'>
        <div className='user-pic-container '>
          <img className='fit-img' src={userPost.photoURL || userAvatar} alt='user'/>
        </div>
        <div className='create-header'>
          <span>{userName}</span>
          <div className='left-bottom-header'>
            <span className='font-grey'>6h · </span>
            <img className='privacy-img' src={privacyIcon} alt='privacy'/>
          </div>
        </div>
      </div>
      <div className='content'>
        <span>{post.content}</span>
      </div>
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
          <span className='post-counter'>0</span>
        </div>
      </div>
      {showComments && <Comments/>}
    </div>
  )
}
