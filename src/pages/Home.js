import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import userAvatar from '../assets/images/user-avatar.png';
import { NavLink } from 'react-router-dom';
import Post from '../components/Home/Post';

export default function Home() {
  const { currentUser, userName, getPosts } = useAuth();
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const unsubscribe = getPosts((querySnapshot) => {
      setPosts(querySnapshot.docs);
    });
    return () => { unsubscribe() };
  }, []) // eslint-disable-line

  return (
    <div className='home-container'>
      <div className='post-redirect'>
        <div className='user-pic-container'>
          <img className='fit-img' src={currentUser.photoURL || userAvatar} alt='user'/>
        </div>
        <NavLink to='/create-post'>Whats on your mind?, {userName}</NavLink>
      </div>
      <div className='post-container'>
        {posts.map((post) => {
          return <Post key={post.id} doc={post}/>
        })}
      </div>
    </div>
  )
}
