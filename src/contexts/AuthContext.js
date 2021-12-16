import React, { useContext, useState, useEffect, useMemo } from 'react'
import { collection, addDoc, onSnapshot, updateDoc,
  doc, setDoc, getDoc, query, where, orderBy } from 'firebase/firestore';
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
import { auth, db } from '../config/firebase';

const AuthContext = React.createContext();
const googleProvider = new GoogleAuthProvider();

export function useAuth() {
  return useContext(AuthContext);
}

export default function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState();
  const [loading, setLoading] = useState(true);

  // start auth user
  function signUp(email, password) {
    return createUserWithEmailAndPassword(auth, email, password);
  }

  function saveUser(email, userId, photoURL = '', displayName = '') {
    return setDoc(doc(db, 'users', userId), {
      userId, email, photoURL, cover: '', displayName, bio: ''
    });
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

  function updateAccount(displayName) {
    return updateProfile(currentUser, { displayName });
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

  function addPost(content, privacy, photo) {
    return addDoc(collection(db, 'posts'), {
      userId: currentUser.uid, content, photo, privacy, likes: [], createdAt: Date.now()
    });
  }

  function getPosts(callback) {
    const q = query(collection(db, 'posts'), where('privacy', '==', 'public'), orderBy('createdAt', 'desc'));
    return onSnapshot(q, callback);
  }

  function getUserDoc(userId) {
    return getDoc(doc(db, 'users', userId));
  }

  function signUpWithGoogle() {
    return signInWithPopup(auth, googleProvider);
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
    userName
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
}
