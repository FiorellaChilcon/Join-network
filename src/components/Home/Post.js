import React, { useEffect, useState, useMemo } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import userAvatar from '../../assets/images/user-avatar.svg';
import privateIcon from '../../assets/images/private.svg';
import publicIcon from '../../assets/images/public.svg';
import heartEmptyIcon from '../../assets/images/heart-empty.svg';
import commentIcon from '../../assets/images/comment.svg';

export default function EditProfile(props) {
  const { doc } = props;
  const post = doc.data();
  const { currentUser, getUserDoc } = useAuth();
  const [userPost, setUserPost] = useState({});

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
        <div><img src={heartEmptyIcon} alt='like' /> {post.likes.length}</div>
        <div><img src={commentIcon} alt='comment' /> 0</div>
      </div>
    </div>
  )
}
