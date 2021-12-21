import React, { useState, useMemo, useRef } from 'react'
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import userAvatar from '../assets/images/user-avatar.svg';
import close from '../assets/images/close.svg';

export default function CreatePost() {
  const navigate = useNavigate();
  const inputFile = useRef(null);
  const { currentUser, userName, addPost, addToastMessage, getPhotoUrl, uploadPhoto } = useAuth();
  const [content, setContent]= useState('');
  const [privacy, setPrivacy]= useState('public');
  const [isLoading, setIsLoading]= useState('');
  const [photoSelected, setPhotoSelected] = useState('');
  const [file, setFile] = useState(null);

  const isDisabled = useMemo(() => {
    return (!content.trim() && !photoSelected) || isLoading;
  }, [isLoading, content, photoSelected]);

  const handleContentChange = ({ target }) => {
    setContent(target.value);
  }

  const handlePrivacyChange = ({ target }) => {
    setPrivacy(target.value);
  }

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      let photo = '';
      let photoName = '';
      if (file) {
        const photoSnapshot = await uploadPhoto(file);
        photo = await getPhotoUrl(photoSnapshot.ref);
        photoName = file.name;
      }
      await addPost(content, privacy, photo, photoName);
      addToastMessage('Your post was published successfully', 'success');
      return navigate('/');
    } catch (error) {
      addToastMessage(error.message, 'error');
    }
    setIsLoading(false);
  }

  const handleFileChange = ({ target }) => {
    const fileSelected = target.files[0];
    const url = URL.createObjectURL(fileSelected);
    setPhotoSelected(url);
    setFile(fileSelected);
  }

  const clearPhoto = (e) => {
    e.preventDefault();
    inputFile.current.value = '';
    setPhotoSelected('');
    setFile(null);
  }

  return (
    <div className='create-post-container'>
      <div className='create-post'>
        <div className='create-post-head-wrapper'>
          <div className='user-pic-container'>
            <img className='fit-img' src={currentUser.photoURL || userAvatar} alt='user'/>
          </div>
          <div className='create-header'>
            <span>{userName}</span>
            <select onChange={handlePrivacyChange}>
              <option value='public'>public</option>
              <option value='private'>private</option>
            </select>
          </div>
        </div>
        <input disabled={isLoading} ref={inputFile} accept='image/png, image/jpeg' type='file' onChange={handleFileChange} />
        {photoSelected &&
          <div className='post-photo-selected-container'>
            <button disabled={isLoading} className='clear-btn' onClick={clearPhoto}><img src={close} alt='clear'/></button>
            <img className='photo-selected' src={photoSelected} alt='pic chosen'/>
          </div>
        }
        <textarea
          onChange={handleContentChange}
          placeholder={`Whats on your mind?, ${userName}`}
        >
        </textarea>
        <button
          onClick={handleSubmit}
          disabled={isDisabled}
        >
          {isLoading ? 'Loading...' : 'Post'}
        </button>
      </div>
    </div>
  )
}
