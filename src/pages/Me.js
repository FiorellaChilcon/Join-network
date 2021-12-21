import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import userAvatar from '../assets/images/user-avatar.svg';
import editIcon from '../assets/images/edit.svg';
import cameraIcon from '../assets/images/camera.svg';
import { NavLink } from 'react-router-dom';
import Post from '../components/Home/Post';
import UploadPhotoModal from '../components/Me/UploadPhotoModal';
import UploadCoverModal from '../components/Me/UploadCoverModal';

export default function Me() {
  const { addToastMessage, updateUser, currentUser, userName, getMyPosts, completeUserName, getUserDoc, updateAccount, removeUserPhotoFromStorage } = useAuth();
  const [posts, setPosts] = useState([]);
  const [user, setUser] = useState({});
  const [editMode, setEditMode] = useState(false);
  const [bioChangeIsLoading, setBioChangeIsLoading] = useState(false);
  const [photoChangeIsLoading, setPhotoChangeIsLoading] = useState(false);
  const [showPhotoMenu, setShowPhotoMenu] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [userBio, setUserBio] = useState('');
  const [newBio, setNewBio] = useState('');
  const [userPhotoName, setUserPhotoName] = useState('');
  const [userCover, setUserCover] = useState('');
  const [coverName, setUserCoverName] = useState('');
  const [showCoverPhotoMenu, setShowCoverPhotoMenu] = useState(false);
  const [coverChangeIsLoading, setCoverChangeIsLoading] = useState(false);
  const [showCoverModal, setShowCoverModal] = useState(false);

  const toggleShowCoverPhotoMenu = () => {
    setShowCoverPhotoMenu((prev) => !prev);
  }

  const openUploadCoverModal = () => {
    setShowCoverPhotoMenu(false);
    setShowCoverModal(true)
  }

  const closeUploadCoverModal = () => {
    setShowCoverModal(false)
  }

  const openUploadPhotoModal = () => {
    setShowPhotoMenu(false);
    setShowModal(true)
  }

  const closeUploadPhotoModal = () => {
    setShowModal(false)
  }

  const toggleShowPhotoMenu = () => {
    setShowPhotoMenu((prev) => !prev);
  }

  const toggleEditMode = () => {
    setEditMode((prev) => !prev);
    setNewBio(userBio);
  }

  const handleChangeBio = ({ target }) => {
    setNewBio(target.value);
  }

  const handleSubmitBio = async (e) => {
    e.preventDefault();
    if (newBio.trim() && newBio.trim() !== user.bio) {
      setBioChangeIsLoading(true);
      try {
        await updateUser({ bio: newBio });
        setUserBio(newBio);
        addToastMessage('Your bio was updated successfully', 'success');
      } catch (error) {
        addToastMessage(error.message, 'error');
      }
      setEditMode(false);
      setBioChangeIsLoading(false);
    }
  }

  const handleRemoveUserPhoto = async (e) => {
    setPhotoChangeIsLoading(true);
    setShowPhotoMenu(false);
    try {
      if (currentUser.photoURL?.includes('firebasestorage')) {
        removeUserPhotoFromStorage(userPhotoName);
      }
      await updateUser({ photoURL: '', photoName: '' });
      await updateAccount({ photoURL: '' });
      setUserPhotoName('');
      addToastMessage('Your photo was updated successfully', 'success');
    } catch (error) {
      addToastMessage(error.message, 'error');
    }
    setPhotoChangeIsLoading(false);
  }

  const handleRemoveCoverPhoto = async (e) => {
    setCoverChangeIsLoading(true);
    setShowCoverPhotoMenu(false);
    try {
      if (userCover?.includes('firebasestorage')) {
        removeUserPhotoFromStorage(coverName);
      }
      await updateUser({ cover: '', coverName: '' });
      setUserCover('');
      setUserCoverName('');
      addToastMessage('Your cover was updated successfully', 'success');
    } catch (error) {
      addToastMessage(error.message, 'error');
    }
    setCoverChangeIsLoading(false);
  }

  const onSetUserPhotoName = (photo) => {
    setUserPhotoName(photo);
  }

  const onSetUserCoverName = (photoName, photo) => {
    setUserCoverName(photoName);
    setUserCover(photo);
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
      setNewBio(userData.bio);
      setUserBio(userData.bio);
      setUserPhotoName(userData.photoName);
      setUserCover(userData.cover);
      setUserCoverName(userData.coverName);
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
          <div className='cover-photo'>
            <div className='cover-pic'>
              {userCover && <img className='fit-img' src={userCover} alt='user'/>}
            </div>
            <button
              disabled={coverChangeIsLoading}
              onClick={toggleShowCoverPhotoMenu}
              className='camera-btn'
            >
              <img src={cameraIcon} alt='update my cover pic'/>
            </button>
            {showCoverPhotoMenu && <div className='change-photo-menu'>
              {userCover && <button onClick={handleRemoveCoverPhoto} className='no-style-btn'>Remove photo</button>}
              <button onClick={openUploadCoverModal} className='no-style-btn'>Update photo</button>
            </div>}
          </div>
          <div className='big-user-pic-container'>
            <div className='big-user-pic'>
              <img className='fit-img' src={currentUser.photoURL || userAvatar} alt='user'/>
            </div>
            <button
              disabled={photoChangeIsLoading}
              onClick={toggleShowPhotoMenu}
              className='camera-btn'
            >
              <img src={cameraIcon} alt='update my profile pic'/>
            </button>
            {showPhotoMenu && <div className='change-photo-menu'>
              {currentUser.photoURL && <button onClick={handleRemoveUserPhoto} className='no-style-btn'>Remove photo</button>}
              <button onClick={openUploadPhotoModal} className='no-style-btn'>Update photo</button>
            </div>}
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
                value={bioChangeIsLoading ? 'updating...' : newBio}  
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
      {showModal &&
        <UploadPhotoModal
          closeModal={closeUploadPhotoModal}
          userPhotoName={userPhotoName}
          onSetUserPhotoName={onSetUserPhotoName}
        />
      }
      {showCoverModal &&
        <UploadCoverModal
          closeModal={closeUploadCoverModal}
          userCoverName={coverName}
          userCover={userCover}
          onSetUserPhotoName={onSetUserCoverName}
        />
      }
    </div>
  )
}
