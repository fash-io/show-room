import { useEffect, useState, useCallback } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from './utils/firebase'
import { fetchAndSetUserData } from './utils/firebaseHandlers'
import Loading from './components/Loaders/Loading'
import Navbar from './components/navbar/Navbar'
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
  MyList,
  PosterBackground,
  TopPeople
} from './pages'
import GalleryModal from './components/GalleryModal'
import SeasonPage from './pages/SeasonPage'

const App = () => {
  const [loading, setLoading] = useState(true)
  const location = useLocation()
  const [user, setUser] = useState(null)
  const [userData, setUserData] = useState(null)
  const [trailerUrl, setTrailerUrl] = useState('')

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

  const shouldHideNavbarAndFooter = useCallback(() => {
    const hiddenPaths = ['/login', '/poster', '/signup']
    return hiddenPaths.includes(location.pathname)
  }, [location.pathname])

  if (loading) {
    return <Loading />
  }

  return (
    <>
      <UserContext.Provider
        value={{ user, userData, trailerUrl, setTrailerUrl }}
      >
        <ToastContainer className={'toast-container z-[1000]'} />

        {!shouldHideNavbarAndFooter() && <Navbar />}

        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/login' element={<Login />} />
          <Route path='/signup' element={<Login />} />
          <Route path='/profile' element={<ProfilePage />} />
          <Route path='/list' element={<MyList />} />
          <Route path='/trending' element={<PopularPage />} />
          <Route path='/person/:id' element={<PersonPage />} />
          <Route path='/search' element={<SearchPage />} />
          <Route path='/collection/:id' element={<CollectionPage />} />
          <Route path='/faq' element={<FAQ />} />
          <Route path='/contact-us' element={<ContactUs />} />
          <Route path='/search/:searchQuery' element={<SearchPage />} />
          <Route path='/poster' element={<PosterBackground />} />
          <Route path='/top-people' element={<TopPeople />} />
          <Route path='/:type/:id' element={<ShowPage />} />
          <Route path='/shows/:type' element={<ShowsPage />} />
          <Route path='/show/:id/season' element={<SeasonPage />} />

          <Route path='*' element={<Error />} />
        </Routes>

        {/* Conditionally render Footer */}
        {!shouldHideNavbarAndFooter() && <Footer />}

        {trailerUrl && (
          <GalleryModal
            selectedData={trailerUrl}
            closeModal={() => setTrailerUrl('')}
          />
        )}
      </UserContext.Provider>
    </>
  )
}

export default App
