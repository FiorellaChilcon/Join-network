import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import userAvatar from '../assets/images/user-avatar.svg';
import editIcon from '../assets/images/edit.svg';
import { NavLink } from 'react-router-dom';
import Post from '../components/Home/Post';

export default function Me() {
  const { addToastMessage, updateUser, currentUser, userName, getMyPosts, completeUserName, getUserDoc } = useAuth();
  const [posts, setPosts] = useState([]);
  const [user, setUser] = useState({});
  const [editMode, setEditMode] = useState(false);
  const [bioChangeIsLoading, setBioChangeIsLoading] = useState(false);
  const [userBio, setUserBio] = useState('');
  const [bio, setBio] = useState('');

  const toggleEditMode = () => {
    setEditMode((prev) => !prev);
    setBio(userBio);
  }

  const handleChangeBio = ({ target }) => {
    setBio(target.value);
  }

  const handleSubmitBio = async (e) => {
    e.preventDefault();
    if (bio.trim() && bio.trim() !== user.bio) {
      setBioChangeIsLoading(true);
      try {
        await updateUser({ bio });
        setUserBio(bio);
        addToastMessage('Your bio was updated successfully', 'success');
      } catch (error) {
        addToastMessage(error.message, 'error');
      }
      setEditMode(false);
      setBioChangeIsLoading(false);
    }
  }

  useEffect(() => {
    const abortController = new AbortController();
    const unsubscribe = getMyPosts((querySnapshot) => {
      setPosts(querySnapshot.docs);
    });

    return () =>  {
      unsubscribe();
      abortController.abort();
    };
  }, [getMyPosts]);

  useEffect(() => {
    const abortController = new AbortController();
    const fetchUser = async () => {
      const resp = await getUserDoc(currentUser.uid);
      const userData = resp.data();
      setUser(userData);
      setBio(userData.bio);
      setUserBio(userData.bio);
    };

    fetchUser();

    return () =>  {
      abortController.abort();
    };
  }, []); //eslint-disable-line

  return (
    <div className='home-container pt-0'>
      <div className='profile-header'>
        <div className='pics-container'>
          <div className='cover-photo'></div>
          <div className='big-user-pic-container'>
            <img className='fit-img' src={currentUser.photoURL || userAvatar} alt='user'/>
          </div>
        </div>
        <h1>{completeUserName}</h1>
        <div className='edit-box'>
          {editMode ?
            <form onSubmit={handleSubmitBio}>
              <input
                disabled={bioChangeIsLoading}
                onChange={handleChangeBio}
                type='text'
                value={bioChangeIsLoading ? 'updating...' : bio}  
              />
            </form> :
            <span>{userBio ? userBio : 'Update your bio!'}</span>
          }
          <button onClick={toggleEditMode} className='no-style-btn'>
            <img src={editIcon}  alt='edit your bio'/>
          </button>
        </div>
      </div>
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
