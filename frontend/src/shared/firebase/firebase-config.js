// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCEp3OsNWucBaYmQSwWXLDu3PSYUR4KVi8",
  authDomain: "auth-8e0f1.firebaseapp.com",
  projectId: "auth-8e0f1",
  storageBucket: "auth-8e0f1.appspot.com",
  messagingSenderId: "436461125830",
  appId: "1:436461125830:web:5e843146348e585e0757c7",
  measurementId: "G-8KXBF68JY5"
};

// Initialize Firebase
export const firebaseapp = initializeApp(firebaseConfig);
const analytics = getAnalytics(firebaseapp);