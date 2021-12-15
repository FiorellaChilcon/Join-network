import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import userAvatar from '../assets/images/user-avatar.png';
import { NavLink } from 'react-router-dom';

export default function Home() {
  const { currentUser, userName, getPosts } = useAuth();
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const unsubscribe = getPosts((querySnapshot) => {
      setPosts(querySnapshot.docs);
    });
    return () => { unsubscribe() };
  }, [])

  return (
    <div className='home-container'>
      <div className='post-redirect'>
        <div className='user-pic-container'>
          <img src={currentUser.photoURL || userAvatar} alt='user'/>
        </div>
        <NavLink to='/create-post'>Whats on your mind?, {userName}</NavLink>
      </div>
      <div>
        {posts.map((post) => {
          return (
            <div key={post.id} className='post'>
              <div className='header'>
                <img src={currentUser.photoURL || userAvatar} alt='user'/>
                <div>
                  <span>User name</span>
                  <div>
                    <span>6h</span>
                    <img src='' />
                  </div>
                </div>
              </div>
              <div>
                <span>{post.data().content}</span>
              </div>
              <div>
                <div><img src='' /> {post.data().likes}</div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
