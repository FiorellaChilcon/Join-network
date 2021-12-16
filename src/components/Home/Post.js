import React, { useEffect, useState, useMemo } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import userAvatar from '../../assets/images/user-avatar.svg';
import privateIcon from '../../assets/images/private.svg';
import publicIcon from '../../assets/images/public.svg';
import heartEmptyIcon from '../../assets/images/heart-empty.svg';
import heartFilledIcon from '../../assets/images/heart-filled.svg';
import commentIcon from '../../assets/images/comment.svg';
import CommentsContainer from './CommentsContainer';
import ReactTimeAgo from 'react-time-ago';

export default function EditProfile(props) {
  const { doc } = props;
  const post = doc.data();
  const { currentUser, getUserDoc, togglePostLike, getPostComments } = useAuth();
  const [userPost, setUserPost] = useState({});
  const [showComments, setShowComments] = useState(false);
  const [comments, setPostComments] = useState([]);

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

  useEffect(() => {
    const unsubscribe = getPostComments(doc.id, (querySnapshot) => {
      setPostComments(querySnapshot.docs);
    });
    return unsubscribe;
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
          <span className='post-counter'>{comments.length}</span>
        </div>
      </div>
      {showComments && <CommentsContainer post={doc} comments={comments} />}
    </div>
  )
}
