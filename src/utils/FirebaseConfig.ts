// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth} from "firebase/auth"
import {collection,getFirestore} from "firebase/firestore"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCDGwF450KJKHToZXZ-AM2E7MFXUUsgDlk",
  authDomain: "pokedex-e78b4.firebaseapp.com",
  projectId: "pokedex-e78b4",
  storageBucket: "pokedex-e78b4.appspot.com",
  messagingSenderId: "974137717299",
  appId: "1:974137717299:web:f01fbc79a9559df58b2946",
  measurementId: "G-WQSDMFBRCN"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
export const firebaseAuth=getAuth(app)
export const firebaseDB=getFirestore(app)
export const usersRef=collection(firebaseDB,"users")
export const pokemonListRef=collection(firebaseDB,"pokemonList")