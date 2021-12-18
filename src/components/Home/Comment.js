import React, { useEffect, useState, useMemo } from 'react'
import userAvatar from '../../assets/images/user-avatar.svg';
import { useAuth } from '../../contexts/AuthContext';
import ReactTimeAgo from 'react-time-ago';
import menu from '../../assets/images/menu-dots.svg';

export default function Comment(props) {
  const { comment } = props;
  const data = comment.data();
  const [userComment, setUserComment] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const { currentUser, getUserDoc, removeDoc, addToastMessage } = useAuth();
  const [showMenu, setShowMenu] = useState(false);
  const myComment = data.userId === currentUser.uid;

  useEffect(() => {
    const abortController = new AbortController();
    const fetchUser = async () => {
      const resp = await getUserDoc(data.userId);
      setUserComment(resp.data())
    }

    if (data.userId === currentUser.uid) {
      setUserComment(currentUser)
    } else {
      fetchUser();
    }

    return () =>  {
      abortController.abort();
    };
  }, [data, currentUser, getUserDoc]);

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
              <img
                onClick={handleShowMenu}
                className={`dot-menu ${isLoading && 'not-allowed'}`}
                src={menu}
                alt='post menu'
              />
              {showMenu &&
                <div className='menu'>
                  {/* <NavLink to={`/post/${comment.id}/edit`}>Edit</NavLink> */}
                  <div role='button' onClick={handleDeletePost}>Delete</div>
                </div>}
            </div>
          }
        </div>
        <div className='text'>
          {data.content}
        </div>
      </div>
    </div>
  )
}
