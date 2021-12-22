import React, { useContext, useState, useEffect, useMemo } from 'react'
import FlashMessage from '../common/FlashMessage';
import {
  collection, addDoc, onSnapshot, updateDoc,
  doc, setDoc, getDoc, query, where, orderBy,
  arrayUnion, arrayRemove, deleteDoc, getDocs
} from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';
import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  updateProfile,
  updateEmail,
  updatePassword,
  GoogleAuthProvider,
  signInWithPopup,
  signOut
} from 'firebase/auth';
import { auth, db, st } from '../config/firebase';

const AuthContext = React.createContext();
const googleProvider = new GoogleAuthProvider();

export function useAuth() {
  return useContext(AuthContext);
}

export default function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState();
  const [loading, setLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState([]);

  // start auth user
  function signUp(email, password) {
    return createUserWithEmailAndPassword(auth, email, password);
  }

  function saveUser(email, userId, photoURL = '', displayName = '') {
    return setDoc(doc(db, 'users', userId), {
      userId, email, photoURL, cover: '', coverName: '', displayName, bio: '', photoName: ''
    });
  }

  function signUpWithGoogle() {
    return signInWithPopup(auth, googleProvider);
  }

  function logIn(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
  }

  function logOut() {
    return signOut(auth);
  }

  function resetPassword(email) {
    return sendPasswordResetEmail(auth, email);
  }

  function updateAccount(changes) {
    return updateProfile(currentUser, changes);
  }

  function updateUserEmail(email) {
    return updateEmail(currentUser, email);
  }

  function updateUser(changes) {
    return updateDoc(doc(db, 'users', currentUser.uid), changes);
  }

  function updateUserPassword(password) {
    return updatePassword(currentUser, password);
  }
  // end auth user

  function addPost(content, privacy, photo = '', photoName = '') {
    return addDoc(collection(db, 'posts'), {
      userId: currentUser.uid, content, photo, photoName, privacy, likes: [], createdAt: Date.now()
    });
  }

  function addComment(postId, content) {
    return addDoc(collection(db, 'comments'), {
      userId: currentUser.uid, postId, content, createdAt: Date.now()
    });
  }

  function updateADoc(collectionName, docId, changes) {
    return updateDoc(doc(db, collectionName, docId), changes);
  }

  function getPosts(callback) {
    const q = query(collection(db, 'posts'), where('privacy', '==', 'public'), orderBy('createdAt', 'desc'));
    return onSnapshot(q, callback);
  }

  function getMyPosts(callback) {
    const q = query(collection(db, 'posts'), where('userId', '==', currentUser.uid), orderBy('createdAt', 'desc'));
    return onSnapshot(q, callback);
  }

  function getPost(postId) {
    return getDoc(doc(db, 'posts', postId));
  }

  function getPostComments(postId, callback) {
    const q = query(collection(db, 'comments'), where('postId', '==', postId), orderBy('createdAt', 'desc'));
    return onSnapshot(q, callback);
  }

  function getUserDoc(userId) {
    return getDoc(doc(db, 'users', userId));
  }

  function togglePostLike(postId, addLike) {
    return updateDoc(doc(db, 'posts', postId), {
      likes: addLike ? arrayUnion(currentUser.uid) : arrayRemove(currentUser.uid)
    });
  }

  function removeDoc(collection, docId) {
    return deleteDoc(doc(db, collection, docId));
  }

  async function removeCommentsAssociated(postId) {
    const q = query(collection(db, 'comments'), where('postId', '==', postId));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      removeDoc('comments', doc.id);
    });
  }

  function uploadPhoto(file, fileName) {
    const storageRef = ref(st, `${currentUser.uid}/${fileName}`);
    return uploadBytesResumable(storageRef, file);
  }

  function getPhotoUrl(refFile) {
    return getDownloadURL(refFile);
  }

  function removeUserPhotoFromStorage(photoName) {
    const storageRef = ref(st, `${currentUser.uid}/${photoName}`);
    return deleteObject(storageRef);
  }

  const userName = useMemo(() => {
    if (currentUser) {
      const { email, displayName } = currentUser;
      const char = displayName ? ' ' : '@';
      const field = displayName ? displayName : email;
  
      return field.split(char)[0];
    }

    return '';
  }, [currentUser]);

  const completeUserName = useMemo(() => {
    if (currentUser) {
      const { email, displayName } = currentUser;
      return displayName ? displayName : email.split('@')[0];
    }

    return '';
  }, [currentUser]);

  // start toast messages
  const removeToastMessage = (date) => {
    setToastMessage((prev) => prev.filter((message) => message.date !== date));
  }

  const addToastMessage = (message, type) => {
    setToastMessage((prev) => [...prev, { message, type, date: Date.now() }]);
  }
  // end toast messages

  useEffect(() => {
    const unsusbscribe = auth.onAuthStateChanged(user => {
      setCurrentUser(user);
      setLoading(false);
    });
    return unsusbscribe;
  }, []);

  const value = {
    currentUser,
    signUp,
    saveUser,
    logIn,
    logOut,
    updateAccount,
    updateUserEmail,
    updateUserPassword,
    updateUser,
    resetPassword,
    addPost,
    getPosts,
    getUserDoc,
    signUpWithGoogle,
    togglePostLike,
    addComment,
    getPostComments,
    removeDoc,
    addToastMessage,
    updateADoc,
    getPost,
    getMyPosts,
    removeCommentsAssociated,
    uploadPhoto,
    getPhotoUrl,
    removeUserPhotoFromStorage,
    userName,
    completeUserName
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
      { toastMessage && 
        <FlashMessage
          flashMessage={toastMessage}
          removeFlashMessage={removeToastMessage}
        />
      }
    </AuthContext.Provider>
  )
}
