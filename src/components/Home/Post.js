import React from 'react';
// import { useAuth } from '../../contexts/AuthContext';
import userAvatar from '../../assets/images/user-avatar.svg';
// import privateIcon from '../../assets/images/private.svg';
import publicIcon from '../../assets/images/public.svg';
import heartEmptyIcon from '../../assets/images/heart-empty.svg';
import commentIcon from '../../assets/images/comment.svg';

export default function EditProfile(props) {
  const { doc } = props;
  // const { currentUser } = useAuth();

  return (
    <div className='post'>
      <div className='create-post-head-wrapper'>
        <div className='user-pic-container '>
          <img className='fit-img' src={userAvatar} alt='user'/>
        </div>
        <div className='create-header'>
          <span>User name</span>
          <div className='left-bottom-header'>
            <span className='font-grey'>6h · </span>
            <img className='privacy-img' src={publicIcon} alt='privacy'/>
          </div>
        </div>
      </div>
      <div className='content'>
        <span>{doc.data().content}</span>
      </div>
      <div className='interact'>
        <div><img src={heartEmptyIcon} alt='like' /> {doc.data().likes.length}</div>
        <div><img src={commentIcon} alt='comment' /> 0</div>
      </div>
    </div>
  )
}
