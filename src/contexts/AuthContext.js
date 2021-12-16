import React, { useContext, useState, useEffect, useMemo } from 'react'
import { collection, addDoc, onSnapshot, updateDoc, doc, setDoc } from "firebase/firestore";
import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  updateProfile,
  updateEmail,
  updatePassword,
  signOut
} from 'firebase/auth';
import { auth, db } from '../config/firebase';

const AuthContext = React.createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export default function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState();
  const [loading, setLoading] = useState(true);

  function signUp(email, password) {
    return createUserWithEmailAndPassword(auth, email, password);
  }

  function saveUser(email, userId) {
    return setDoc(doc(db, 'users', userId), {
      userId, email, photoURL: '', cover: '', displayName: '', bio: ''
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

  function addPost(content, privacy, photo) {
    return addDoc(collection(db, 'posts'), {
      userId: currentUser.uid, content, photo, privacy, likes: []
    });
  }

  function getPosts(callback) {
    return onSnapshot(collection(db, 'posts'), callback);
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
    userName
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
}
