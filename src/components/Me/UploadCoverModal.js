import React, { useState, useRef } from 'react'
import close from '../../assets/images/close.svg';
import { useAuth } from '../../contexts/AuthContext';

export default function UploadCoverModal(props) {
  const { closeModal, userCoverName, onSetUserPhotoName, userCover } = props;
  const { uploadPhoto, getPhotoUrl, addToastMessage, updateUser, removeUserPhotoFromStorage } = useAuth();
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
      if (userCover?.includes('firebasestorage')) {
        removeUserPhotoFromStorage(userCoverName);
      }
      const fileName = `${Date.now()}-${file.name}`;
      const snapshot = await uploadPhoto(file, fileName);
      const cover = await getPhotoUrl(snapshot.ref);
      updateUser({ cover, coverName: fileName });
      onSetUserPhotoName(fileName, cover);
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
