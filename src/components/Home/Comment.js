import React, { useEffect, useState, useMemo } from 'react'
import userAvatar from '../../assets/images/user-avatar.svg';
import { useAuth } from '../../contexts/AuthContext';
import ReactTimeAgo from 'react-time-ago';

export default function Comment(props) {
  const { comment } = props;
  const data = comment.data();
  const [userComment, setUserComment] = useState({});
  const { currentUser, getUserDoc } = useAuth();

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


  return (
    <div className='comment'>
      <div className='comment-pic-container'>
        <img className='fit-img' src={userComment.photoURL || userAvatar} alt='user'/>
      </div>
      <div className='content'>
        <div className='name'>
          {userName}
          <span> · <ReactTimeAgo date={data.createdAt} timeStyle='twitter' locale="en-US"/></span>
        </div>
        <div className='text'>
          {data.content}
        </div>
      </div>
    </div>
  )
}
