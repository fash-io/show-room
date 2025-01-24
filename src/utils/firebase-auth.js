import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  setPersistence,
  browserLocalPersistence
} from 'firebase/auth'
import { setDoc, doc } from 'firebase/firestore'
import { auth, db, safeAsync } from './firebase'
import { toast } from 'react-toastify'

const signup = async (name, email, password) => {
  return safeAsync(async () => {
    const response = await createUserWithEmailAndPassword(auth, email, password)
    const user = response.user

    const userDocRef = doc(db, 'users', user.uid)
    await setDoc(userDocRef, {
      uid: user.uid,
      name,
      authProvider: 'local',
      email,
      createdAt: new Date().toISOString()
    })

    toast.success('Signup successful!')
    return user
  })
}

const login = async (email, password) => {
  return safeAsync(async () => {
    await setPersistence(auth, browserLocalPersistence)

    const response = await signInWithEmailAndPassword(auth, email, password)
    const user = response.user

    toast.success('Login successful!')
    return user
  })
}

const logout = async () => {
  try {
    await signOut(auth)
    toast.info('Logged out successfully')
  } catch (error) {
    console.error('Error logging out:', error.message)
    toast.error('Error logging out')
  }
}
export { login, signup, logout }
