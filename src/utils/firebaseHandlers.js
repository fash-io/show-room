import { toast } from 'react-toastify'
import { db } from './firebase'
import { doc, getDoc } from 'firebase/firestore'

const fetchUserData = async user => {
  if (!user?.uid) {
    console.error('User not logged in or UID is missing')
    toast.error('You need to log in to access user data.')
    return null
  }

  try {
    const userDocRef = doc(db, 'users', user.uid)
    const userDoc = await getDoc(userDocRef)

    if (!userDoc.exists()) {
      console.error('User document not found')
      toast.error('User document not found.')
      return null
    }

    return userDoc.data()
  } catch (error) {
    console.error('Error fetching user document:', error)
    toast.error('An error occurred while fetching user data.')
    return null
  }
}

const fetchAndSetUserData = async (user_, setUserData) => {
  if (!user_) {
    console.error('Invalid user object passed')
    toast.error('Invalid user data.')
    return
  }

  try {
    const data = await fetchUserData(user_)
    if (data) {
      setUserData(data)
    } else {
      toast.error('Failed to fetch user data.')
    }
  } catch (err) {
    console.error('Error fetching user data:', err)
    toast.error('An error occurred while fetching user data.')
  }
}

export { fetchUserData, fetchAndSetUserData }
