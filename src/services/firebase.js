import { initializeApp } from "firebase/app";
import { getAuth} from "firebase/auth";
import { getDatabase} from 'firebase/database'

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_KEY,
  authDomain: "capstone-ehatid.firebaseapp.com",
  databaseURL: "https://capstone-ehatid.firebaseio.com",
  projectId: "capstone-ehatid",
  storageBucket: "capstone-ehatid.appspot.com",
  messagingSenderId: "905231775035",
  appId: "1:905231775035:web:7e89a05691d55b9d8ff31e"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getDatabase(app);