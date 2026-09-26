import { GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import React from 'react'
import {FcGoogle} from "react-icons/fc"
import { motion } from 'framer-motion';
import { firebaseAuth, usersRef } from '../utils/FirebaseConfig';
import { addDoc, getDocs, query, where } from 'firebase/firestore';
import { useAppDispatch } from '../app/hooks';
import { setToast, setUserStatus } from '../app/slices/AppSlice';
import type { Dispatch } from '@reduxjs/toolkit';

// Closing the popup or clicking twice is the user changing their mind, not an error.
const cancelled = ['auth/popup-closed-by-user', 'auth/cancelled-popup-request', 'auth/user-cancelled'];

// Thunks that never read state, so any dispatch (components or other thunks) can run them.
// Dispatch login straight from a click handler: the popup must open inside the user's gesture.
export const login = () => async (dispatch: Dispatch) => {
  try {
    const {
      user: { email, uid },
    } = await signInWithPopup(firebaseAuth, new GoogleAuthProvider());
    if (!email) return;
    dispatch(setUserStatus({ email }));
    // Profile record only; the session is already live, so a failure here is just logged.
    getDocs(query(usersRef, where("uid", "==", uid)))
      .then((found) => { if (found.empty) return addDoc(usersRef, { uid, email }); })
      .catch(console.error);
  } catch (err) {
    const code = (err as { code?: string }).code ?? '';
    if (cancelled.includes(code)) return;
    console.error(err);
    dispatch(setToast(code === 'auth/popup-blocked'
      ? 'Pop-up blocked. Allow pop-ups for this site to log in.'
      : 'Login failed. Please try again.'));
  }
};

export const logout = () => (dispatch: Dispatch) =>
  signOut(firebaseAuth)
    .then(() => {
      dispatch(setUserStatus(null));
      dispatch(setToast("Logged out successfully!"));
    })
    .catch(() => dispatch(setToast("Logout failed. Please try again.")));

function Login() {
  const dispatch = useAppDispatch();
  return (
    <div className="login">
      <motion.button whileTap={{ scale: 0.95 }} onClick={() => dispatch(login())} className="login-btn">
        <FcGoogle /> Login with Google
      </motion.button>
    </div>
  );
}

export default Login;
