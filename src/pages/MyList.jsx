import { useContext, useEffect, useState } from 'react'
import ShowCard from '../components/ShowCard'
import Error from '../components/Error'
import { fetchWatchListData } from '../utils/api'
import UserContext from '../UserContext'
import { Link } from 'react-router-dom'
import Loader_ from '../components/Loaders/Loader_'

const MyListPage = () => {
  const { user, userData } = useContext(UserContext)
  const [favorites, setFavorites] = useState([])
  const [watchList, setWatchList] = useState([])
  const [watched, setWatched] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [data, setData] = useState([])
  const [dataSet, setDataSet] = useState('watchList')
  const [mediaType, setMediaType] = useState('all')

  useEffect(() => {
    if (user) {
      fetchWatchListData(
        setLoading,
        setError,
        setFavorites,
        setWatchList,
        setWatched,
        userData,
        user
      )
    }
  }, [user, userData])

  useEffect(() => {
    handleSetDataSet(dataSet, mediaType)
  }, [favorites, watchList, watched, dataSet, mediaType, user])

  const handleSetDataSet = (set, type) => {
    setDataSet(set)
    setMediaType(type)
    let filteredData
    switch (set) {
      case 'watchList':
        filteredData = watchList
        break
      case 'watched':
        filteredData = watched
        break
      case 'favorite':
        filteredData = favorites
        break
      default:
        filteredData = favorites
    }

    if (type !== 'all') {
      const mediaTypeKey = type === 'movie' ? 'movie' : 'series'
      filteredData = filteredData.filter(item => item.type === mediaTypeKey)
    }
    setData(filteredData)
  }

  if (!user) {
    return (
      <>
        <div className='p-8 min-h-screen flex justify-center items-center  text-white'>
          <div className='relative flex flex-col items-center bg-gray-800/80 p-8 rounded-xl shadow-lg'>
            <h2 className='text-2xl font-bold mb-4'>Welcome to ShowRoom!</h2>
            <p className='text-gray-400 mb-6'>
              You need to log in to access your profile and personalized
              content.
            </p>
            <Link
              to='/login'
              className='px-6 py-3 bg-blue-600 text-white rounded shadow hover:bg-blue-700 transition'
            >
              Login
            </Link>
            <p className='text-sm text-gray-400 mt-4'>
              Don't have an account?{' '}
              <Link to='/signup' className='text-blue-400 hover:underline'>
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </>
    )
  }

  if (error) {
    return <Error error={error} />
  }

  return (
    <>
      {loading && <Loader_ />}
      <div className='min-h-screen text-white py-20 px-4 sm:px-8 lg:px-8'>
        <div className='flex flex-col lg:flex-row items-center justify-between mb-10 space-y-4 lg:space-y-0 sm:px-20'>
          <div className='flex flex-wrap items-center space-x-4'>
            {['all', 'movie', 'tv'].map(type => (
              <button
                key={type}
                onClick={() => setMediaType(type)}
                className={`px-4 py-2 rounded-full ${
                  mediaType === type
                    ? `${
                        type === 'all'
                          ? 'bg-blue-500'
                          : type === 'movie'
                          ? 'bg-green-500'
                          : 'bg-purple-500'
                      } text-white`
                    : 'bg-gray-700 text-gray-300'
                } hover:bg-${
                  type === 'all'
                    ? 'blue'
                    : type === 'movie'
                    ? 'green'
                    : 'purple'
                }-600 transition-colors`}
              >
                {type === 'all'
                  ? 'All'
                  : type === 'movie'
                  ? 'Movies'
                  : 'TV Shows'}
              </button>
            ))}
          </div>

          <div className='flex flex-wrap items-center space-x-2'>
            {['watchList', 'favorite', 'watched'].map(set => (
              <button
                key={set}
                onClick={() => handleSetDataSet(set, mediaType)}
                className={`px-4 py-2 rounded-full ${
                  dataSet === set
                    ? `${
                        set === 'favorite'
                          ? 'bg-red-500'
                          : set === 'watchList'
                          ? 'bg-orange-500'
                          : 'bg-pink-600'
                      } text-white`
                    : 'bg-gray-700 text-gray-300'
                } hover:bg-${
                  set === 'favorite'
                    ? 'red'
                    : set === 'watchList'
                    ? 'orange'
                    : 'pink'
                }-600 transition-colors`}
              >
                {set === 'watchList'
                  ? 'Watch List'
                  : set === 'favorite'
                  ? 'Favorite'
                  : 'Watched'}
              </button>
            ))}
          </div>
        </div>

        <div className='container mx-auto px-4 py-8'>
          <h2 className='text-center text-4xl sm:text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-[#1a2a6c] via-pink-500 to-[#ff7e5f] mb-12'>
            {dataSet === 'favorite'
              ? 'Favorites'
              : dataSet === 'watchList'
              ? 'Watch List'
              : 'Watched'}
          </h2>

          {data.length === 0 ? (
            <p className='text-center text-gray-400 text-lg col-span-full'>
              No items found.
            </p>
          ) : (
            <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8 '>
              {data.map((show, i) => (
                <div
                  key={i}
                  className='relative group rounded-lg overflow-hidden shadow-lg '
                >
                  <ShowCard
                    show={show}
                    type_={show.type}
                    type={4}
                    user={user}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default MyListPage
