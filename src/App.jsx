import { useEffect, useState } from 'react'
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from './utils/firebase'
import { fetchAndSetUserData } from './utils/firebaseHandlers'
import Loading from './components/Loading'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import UserContext from './UserContext'

import {
  Home,
  Login,
  ShowPage,
  PersonPage,
  SearchPage,
  ShowsPage,
  PopularPage,
  Error,
  ProfilePage,
  ContactUs,
  FAQ,
  CollectionPage,
  MyList
} from './pages'
import PosterBackground from './pages/PosterBackground'

const App = () => {
  const [isExploring, setIsExploring] = useState(false)
  const [loading, setLoading] = useState(true)
  const location = useLocation()
  const [user, setUser] = useState(null)
  const [userData, setUserData] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async user_ => {
      if (user_) {
        setUser(user_)
        await fetchAndSetUserData(user_, setUserData)
      } else {
        setUser(null)
        setUserData(null)
      }
      setLoading(false)
    })
    return () => unsubscribe()
  }, [])

  useEffect(() => {
    if (!loading) {
      if (!isExploring && !user) {
        navigate('/login')
      }
    }
  }, [isExploring, loading, user, navigate])

  if (loading) {
    return <Loading />
  }

  return (
    <>
      <UserContext.Provider value={{ user: user, userData: userData }}>
        <ToastContainer className={'toast-container z-[1000]'} />
        {(location.pathname !== '/login' || location.pathname !== 'poster') && (
          <Navbar />
        )}
        <Routes>
          <Route path='/' element={<Home />} />
          <Route
            path='/login'
            element={<Login setIsExploring={setIsExploring} />}
          />
          <Route path='/profile' element={<ProfilePage />} />
          <Route path='/list' element={<MyList />} />
          <Route path='/movies' element={<ShowsPage />} />
          <Route path='/series' element={<ShowsPage />} />
          <Route path='/trending' element={<PopularPage />} />
          <Route path='/person/:id' element={<PersonPage />} />
          <Route path='/collection/:id' element={<CollectionPage />} />
          <Route path='/:type/:id' element={<ShowPage />} />
          <Route path='/search/:searchQuery' element={<SearchPage />} />
          <Route path='/search' element={<SearchPage />} />
          <Route path='/contact-us' element={<ContactUs />} />
          <Route path='/poster' element={<PosterBackground />} />
          <Route path='/faq' element={<FAQ />} />
          <Route path='*' element={<Error />} />
        </Routes>
        {location.pathname !== '/login' && location.pathname !== 'poster' && (
          <Footer />
        )}
      </UserContext.Provider>
    </>
  )
}

export default App
