import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import userAvatar from '../assets/images/user-avatar.png';
import { NavLink } from 'react-router-dom';

export default function Home() {
  const { currentUser, userName, getPosts } = useAuth();
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    getPosts().then((resp) => {
      setPosts(resp.docs);
    });
    return () => { setPosts([]); };
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
            <div>
              photo: {post.data().photo} <br/>
              likes: {post.data().likes} <br/>
              content: {post.data().content} <br/>
              privacy: {post.data().privacy} <br/>
              userId: {post.data().userId} <br/> <br/> <br/>
            </div>
          )
        })}
      </div>
    </div>
  )
}
