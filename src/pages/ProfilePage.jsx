import { useState, useEffect, useContext } from 'react'
import { db, auth, storage } from '../utils/firebase'
import { doc, getDoc, updateDoc } from 'firebase/firestore'
import { onAuthStateChanged } from 'firebase/auth'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import Error from '../components/Error'
import { handleLogout, handleRemoveItem } from '../utils/firebaseHandlers'
import GoBackButton from '../components/GoBackButton'
import { useNavigate } from 'react-router-dom'
import Loading from '../components/Loading'
import { fetchWatchlistData } from '../utils/api'
import UserContext from '../UserContext'

const ProfilePage = () => {
  const { user, userData } = useContext(UserContext)
  const navigator = useNavigate()
  const [userData_, setUserData] = useState(null)
  const [error, setError] = useState(null)
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({})
  const [file, setFile] = useState(null)
  const [isUploading, setIsUploading] = useState(false)
  const [loading, setLoading] = useState(false)
  const [favorites, setFavorites] = useState([])
  const [watchlist, setWatchlist] = useState([])
  const [watched, setWatched] = useState([])
  const [activeTab, setActiveTab] = useState('favorites')
  const [formErrors, setFormErrors] = useState({})

  useEffect(() => {
    fetchWatchlistData(
      setLoading,
      setError,
      setFavorites,
      setWatchlist,
      setWatched,
      userData,
      user
    )

    const fetchUserData = async uid => {
      try {
        setLoading(true)
        const userDocRef = doc(db, 'users', uid)
        const userDocSnap = await getDoc(userDocRef)

        if (userDocSnap.exists()) {
          setUserData(userDocSnap.data())
          setFormData(userDocSnap.data())
        } else {
          setError('No user data found.')
        }
      } catch (error) {
        setError('Error fetching user data.')
      } finally {
        setLoading(false)
      }
    }

    const unsubscribe = onAuthStateChanged(auth, user => {
      if (user) {
        fetchUserData(user.uid)
      } else {
        setUserData(null)
      }
    })

    return () => unsubscribe()
  }, [userData])

  const handleEditToggle = () => {
    setIsEditing(!isEditing)
  }

  const handleChange = e => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleFileChange = e => {
    setFile(e.target.files[0])
  }

  const handleSubmit = async e => {
    e.preventDefault()

    const errors = {}
    if (!formData.name) errors.name = 'Name is required.'
    if (!formData.phoneNumber) errors.phoneNumber = 'Phone number is required.'
    if (!formData.address) errors.address = 'Address is required.'

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors)
      return
    }

    try {
      let photoURL = userData_.photoURL

      if (file) {
        setIsUploading(true)
        const storageRef = ref(
          storage,
          `profileImages/${auth.currentUser.uid}/${file.name}`
        )
        await uploadBytes(storageRef, file)
        photoURL = await getDownloadURL(storageRef)
        setIsUploading(false)
      }

      const userDocRef = doc(db, 'users', auth.currentUser.uid)
      const updateData = {
        ...formData,
        ...(photoURL && { photoURL })
      }

      await updateDoc(userDocRef, updateData)
      setUserData({ ...formData, photoURL })
      setIsEditing(false)
    } catch (error) {
      console.error('Error updating user data:', error.message)
      setError(`Error updating user data: ${error.message}`)
    }
  }

  const handle_Logout = () => {
    handleLogout()
    navigator('/')
  }

  if (error) {
    return <Error error={error} />
  }
  if (loading) {
    return <Loading transparent={true} />
  }

  if (userData_ === null) {
    return (
      <div className='p-8 min-h-screen flex justify-center items-center bg-gray-900 text-white'>
        <p className='text-lg'>No user data available.</p>
      </div>
    )
  }

  const renderTabContent = () => {
    let data
    switch (activeTab) {
      case 'favorites':
        data = favorites
        break
      case 'watchlist':
        data = watchlist
        break
      case 'watched':
        data = watched
        break
      default:
        data = []
    }

    if (data.length === 0) {
      return (
        <p className='text-gray-400 mt-4'>You have no {activeTab} items yet.</p>
      )
    }

    return data.map(item => (
      <div
        key={item.id}
        className='mt-4 px-6 py-3 shadow-lg rounded bg-gray-800 flex justify-between items-center transition'
      >
        <div className='flex items-center space-x-4'>
          <img
            src={`https://image.tmdb.org/t/p/w500${item.backdrop_path}`}
            alt={item.name || item.original_title}
            className='w-24 h-36 object-cover rounded'
          />
          <div>
            <h3 className='text-lg font-bold text-white'>
              {item.name || item.original_title}
            </h3>
            <p className='text-gray-400'>
              {item.release_date || item.first_air_date}
            </p>
          </div>
        </div>
        <button
          onClick={() => handleRemoveItem(item.id, item.type, user, activeTab)}
          className='text-red-500 hover:text-red-700 transition'
        >
          <i className='fa fa-trash'></i>
        </button>
      </div>
    ))
  }

  return (
    <>
      <GoBackButton />
      <div className='bg-gradient-to-r from-gray-800 via-gray-900 to-black min-h-screen flex items-center justify-center flex-col'>
        <div className='sm:bg-gray-900/80 text-white rounded-lg sm:shadow-xl max-w-4xl w-full p-8'>
          <div className='flex flex-col items-center'>
            {userData_.photoURL ? (
              <img
                src={userData_.photoURL}
                alt='Profile'
                className='rounded-full w-40 h-40 object-cover shadow-lg'
              />
            ) : (
              <div className='w-40 h-40 bg-gray-700 rounded-full flex items-center justify-center text-white text-4xl shadow-lg'>
                <i className='fa fa-user'></i>
              </div>
            )}
            <h2 className='mt-4 text-3xl font-bold'>{userData_.name}</h2>
            <div className='flex gap-4'>
              <button
                onClick={handleEditToggle}
                className='mt-4 px-3 py-1 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition'
              >
                {isEditing ? 'Cancel' : 'Edit'}
              </button>
              <button
                onClick={handle_Logout}
                className='mt-4 px-3  py-1 bg-red-600 text-white rounded-lg shadow hover:bg-red-700 transition'
              >
                Logout
              </button>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className='flex justify-around mt-8 mb-6'>
            <button
              onClick={() => setActiveTab('favorites')}
              className={`text-white py-2 px-4 rounded ${
                activeTab === 'favorites'
                  ? 'bg-blue-500'
                  : 'bg-gray-700 hover:bg-gray-600'
              }`}
            >
              Favorites
            </button>
            <button
              onClick={() => setActiveTab('watchlist')}
              className={`text-white py-2 px-4 rounded ${
                activeTab === 'watchlist'
                  ? 'bg-blue-500'
                  : 'bg-gray-700 hover:bg-gray-600'
              }`}
            >
              Watchlist
            </button>
            <button
              onClick={() => setActiveTab('watched')}
              className={`text-white py-2 px-4 rounded ${
                activeTab === 'watched'
                  ? 'bg-blue-500'
                  : 'bg-gray-700 hover:bg-gray-600'
              }`}
            >
              Watched
            </button>
          </div>

          {/* Tab Content */}
          <div>{renderTabContent()}</div>

          {isEditing && (
            <form onSubmit={handleSubmit} className='mt-6'>
              <div className='mb-4'>
                <label className='block text-sm text-gray-400'>Name:</label>
                <input
                  type='text'
                  name='name'
                  value={formData.name || ''}
                  onChange={handleChange}
                  className='w-full mt-1 px-3 py-2 rounded bg-gray-700 text-white'
                />
                {formErrors.name && (
                  <p className='text-red-500'>{formErrors.name}</p>
                )}
              </div>

              <div className='mb-4'>
                <label className='block text-sm text-gray-400'>
                  Phone Number:
                </label>
                <input
                  type='text'
                  name='phoneNumber'
                  value={formData.phoneNumber || ''}
                  onChange={handleChange}
                  className='w-full mt-1 px-3 py-2 rounded bg-gray-700 text-white'
                />
                {formErrors.phoneNumber && (
                  <p className='text-red-500'>{formErrors.phoneNumber}</p>
                )}
              </div>

              <div className='mb-4'>
                <label className='block text-sm text-gray-400'>Address:</label>
                <input
                  type='text'
                  name='address'
                  value={formData.address || ''}
                  onChange={handleChange}
                  className='w-full mt-1 px-3 py-2 rounded bg-gray-700 text-white'
                />
                {formErrors.address && (
                  <p className='text-red-500'>{formErrors.address}</p>
                )}
              </div>

              <div>
                <label className='block text-sm text-gray-400'>
                  Profile Image:
                </label>
                <input
                  type='file'
                  accept='image/*'
                  onChange={handleFileChange}
                  className='w-full mt-1'
                />
                {isUploading && (
                  <p className='text-yellow-500'>Uploading image...</p>
                )}
              </div>

              <button
                type='submit'
                className='mt-4 px-6 py-3 bg-green-600 text-white rounded-lg shadow hover:bg-green-700 transition'
                disabled={isUploading}
              >
                {isUploading ? 'Uploading...' : 'Save Changes'}
              </button>
            </form>
          )}
        </div>
      </div>
    </>
  )
}

export default ProfilePage
