import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import googleIcon from '../../assets/images/google.png'

export default function SignInWithProvider(props) {
  const navigate = useNavigate();
  const { onAddErrorMessage } = props;
  const { signUpWithGoogle, getUserDoc, saveUser } = useAuth();

  const signWithGoogle = async () => {
    try {
      const result = await signUpWithGoogle();
      const { email, uid ,photoURL, displayName } = result.user;
      const docSnap = await getUserDoc(uid);
      if (!docSnap.exists()) {
        await saveUser(email, uid, photoURL, displayName);
      }
      return navigate('/');

    } catch (error) {
      onAddErrorMessage(error.message);
    }
  }

  return (
    <div
      onClick={signWithGoogle}
      role='button'
      className='sign-in-with-provider pointer'
    >
      <img src={googleIcon} alt='sign in google'/>
      Continue with google
    </div>
  )
}
