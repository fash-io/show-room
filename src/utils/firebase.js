import { initializeApp } from "firebase/app";
import {
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { getFirestore, setDoc, doc, getDoc } from "firebase/firestore";
import { getStorage } from "firebase/storage"; // Import Firebase Storage
import { toast } from "react-toastify";
// import { db } from "./firebase"; // Adjust the import based on your project structure


const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app); // Initialize Firebase Storage

const signup = async (name, email, password) => {
  try {
    const response = await createUserWithEmailAndPassword(auth, email, password);
    const user = response.user;

    const userDocRef = doc(db, "users", user.uid);
    await setDoc(userDocRef, {
      uid: user.uid,
      name,
      authProvider: "local",
      email,
    });

    console.log("Successfully signed up", user);
    window.location = "/";
  } catch (error) {
    console.error("Error signing up:", error.message);
    throw new Error(`Signup failed: ${error.message}`);
  }
};

const login = async (email, password) => {
  try {
    const response = await signInWithEmailAndPassword(auth, email, password);
    const user = response.user;
    console.log("Successfully logged in", user);
  } catch (error) {
    console.error("Error logging in:", error.message);
    throw new Error(`Login failed: ${error.message}`);
  }
};

const logout = async () => {
  try {
    await signOut(auth);
    console.log("Successfully logged out");
  } catch (error) {
    console.error("Error logging out:", error.message);
  }
};


export const storeWatchList = async (uid, newItem) => {
  try {
    const userDocRef = doc(db, "users", uid);
    const userDoc = await getDoc(userDocRef);

    let watchList = [];

    if (userDoc.exists()) {
      watchList = userDoc.data().watchList || [];
      if (!Array.isArray(watchList)) {
        watchList = [];
      }
    }

    // Check if the item already exists in the watch list
    if (!watchList.find(item => item.id === newItem.id && item.type === newItem.type)) {
      watchList.push(newItem);
      await setDoc(userDocRef, { watchList }, { merge: true });
      console.log("Watch list updated successfully");
      toast.success("Added to watch list");
    } else {
      console.log("Item already in watch list");
      toast.error("Item already in watch list");
    }
  } catch (error) {
    console.error("Error storing watch list:", error.message);
  }
};


export { auth, db, storage, signup, login, logout  }; // Export storage
