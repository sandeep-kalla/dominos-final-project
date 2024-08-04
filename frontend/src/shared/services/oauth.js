import { firebaseapp } from "../firebase/firebase-config";
import axios from 'axios';
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut } from "firebase/auth";

export const OAuth = async () => {
  // Login with Gmail
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: "select_account" });

  const auth = getAuth();
  const userCred = await signInWithPopup(auth, provider);
  
  const { uid, displayName, photoURL } = userCred.user;

  console.log(uid);
  console.log(displayName);
  console.log(photoURL);

  await axios.post(`${import.meta.env.VITE_BASE_URL}/saveUser`, {
    uid,
    displayName,
    photoURL
  });

  return userCred;
};


export const logout = async () => {
    const auth = getAuth();
    await signOut(auth);
  };
