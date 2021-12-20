import React, { useState, useRef } from 'react'
import close from '../../assets/images/close.svg';
import { useAuth } from '../../contexts/AuthContext';

export default function UploadPhotoModal(props) {
  const { closeModal, userPhotoName, onSetUserPhotoName } = props;
  const { uploadPhoto, getPhotoUrl, addToastMessage, updateUser, updateAccount, removeUserPhotoFromStorage, currentUser } = useAuth();
  const inputFile = useRef(null);
  const [photoSelected, setPhotoSelected] = useState('');
  const [isLoading, setIsLoading] = useState('');
  const [file, setFile] = useState(null);

  const handleChange = ({ target }) => {
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

  const handleClick = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (currentUser.photoURL?.includes('firebasestorage')) {
        removeUserPhotoFromStorage(userPhotoName);
      }
      const snapshot = await uploadPhoto(file);
      const photoURL = await getPhotoUrl(snapshot.ref);
      updateAccount({ photoURL, photoName: file.name });
      updateUser({ photoURL, photoName: file.name });
      onSetUserPhotoName(file.name);
      closeModal();
      addToastMessage('Your changes were saved!', 'success');
    } catch (error) {
      addToastMessage(error.message, 'error');
      setIsLoading(false);
    }
  }

  return (
    <div className='modal-bg'>
      <div className='modal'>
        <button disabled={isLoading}  onClick={closeModal} className='close-btn no-style-btn'>
          <img src={close} alt='close modal'/>
        </button>
        <form className='photo-form'>
          <input disabled={isLoading} ref={inputFile} accept='image/png, image/jpeg' type='file' onChange={handleChange} />
          {photoSelected &&
            <div className='photo-selected-container'>
              <button disabled={isLoading} className='clear-btn' onClick={clearPhoto}><img src={close} alt='clear'/></button>
              <img className='photo-selected' src={photoSelected} alt='pic chosen'/>
            </div>
          }
          <button
            className='submit-photo'
            onClick={handleClick}
            disabled={isLoading || !photoSelected}
          >
            {isLoading ? 'Loading...' : 'Submit'}
          </button>
        </form>
      </div>
    </div>
  )
}
