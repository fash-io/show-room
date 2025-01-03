import { initializeApp } from 'firebase/app'
import {
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
  signOut
} from 'firebase/auth'
import { getFirestore, setDoc, doc, getDoc } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'
import { toast } from 'react-toastify'
import { setPersistence, browserLocalPersistence } from 'firebase/auth'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
}

const app = initializeApp(firebaseConfig)
const auth = getAuth(app)
const db = getFirestore(app)
const storage = getStorage(app)

const signup = async (name, email, password) => {
  try {
    const response = await createUserWithEmailAndPassword(auth, email, password)
    const user = response.user

    const userDocRef = doc(db, 'users', user.uid)
    await setDoc(userDocRef, {
      uid: user.uid,
      name,
      authProvider: 'local',
      email
    })
  } catch (error) {
    console.error('Error signing up:', error.message)
    throw new Error(`Signup failed: ${error.message}`)
  }
}

const login = async (email, password) => {
  try {
    await setPersistence(auth, browserLocalPersistence)
    const response = await signInWithEmailAndPassword(auth, email, password)
    const user = response.user
  } catch (error) {
    console.error('Error logging in:', error.message)
    throw new Error(`Login failed: ${error.message}`)
  }
}

const logout = async () => {
  try {
    await signOut(auth)
    toast.info('Logged out')
  } catch (error) {
    console.error('Error logging out:', error.message)
  }
}

const storeItem = async (uid, newItem, listType) => {
  try {
    const userDocRef = doc(db, 'users', uid)
    const userDoc = await getDoc(userDocRef)

    let list = []

    if (userDoc.exists()) {
      list = userDoc.data()[listType] || []
      if (!Array.isArray(list)) {
        list = []
      }
    }

    if (
      !list.find(item => item.id === newItem.id && item.type === newItem.type)
    ) {
      list.push(newItem)
      await setDoc(userDocRef, { [listType]: list }, { merge: true })
      toast.success(`Added to ${listType}`)
    } else {
      toast.error(`Item already in ${listType}`)
    }
  } catch (error) {
    console.error(`Error storing ${listType}:`, error.message)
  }
}

export { auth, db, storage, signup, login, logout, storeItem }
