import { useEffect, useState, useRef, useCallback } from 'react'
import Error from '../components/Error'
import Loader_ from '../components/Loader_' // A loader_ component
import { options } from '../utils/api'
import ShowCard from '../components/ShowCard'
import { FaFilter, FaTimes } from 'react-icons/fa'

const PopularPage = () => {
  const [mediaType, setMediaType] = useState('all')
  const [timeWindow, setTimeWindow] = useState('day')
  const [page, setPage] = useState(1)
  const [popularMovies, setPopularMovies] = useState([])
  const [prefetchedMovies, setPrefetchedMovies] = useState([])
  const [totalPages, setTotalPages] = useState(1)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const [isPrefetching, setIsPrefetching] = useState(false)
  const [showFilters, setShowFilters] = useState(false) // State to manage filter visibility
  const observerRef = useRef()

  const fetchMovies = useCallback(async () => {
    try {
      setLoading(true)
      const url = `https://api.themoviedb.org/3/trending/${mediaType}/${timeWindow}?language=en-US&page=${page}`
      const response = await fetch(url, options)
      if (!response.ok) {
        throw new Error('Failed to fetch new releases.')
      }
      const data = await response.json()
      setPopularMovies(prevMovies => [...prevMovies, ...data.results])
      setTotalPages(data.total_pages)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [mediaType, timeWindow, page])

  const prefetchMovies = useCallback(async () => {
    if (page + 1 > totalPages || isPrefetching) return
    try {
      setIsPrefetching(true)
      const url = `https://api.themoviedb.org/3/trending/${mediaType}/${timeWindow}?language=en-US&page=${
        page + 1
      }`
      const response = await fetch(url, options)
      if (!response.ok) {
        throw new Error('Failed to prefetch new releases.')
      }
      const data = await response.json()
      setPrefetchedMovies(data.results)
    } catch (err) {
      console.error(err.message)
    } finally {
      setIsPrefetching(false)
    }
  }, [mediaType, timeWindow, page, totalPages, isPrefetching])

  useEffect(() => {
    fetchMovies()
  }, [fetchMovies])

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'instant'
    })
    setPopularMovies([])
    setPage(1)
    setShowFilters(false)
  }, [mediaType, timeWindow])

  const handleObserver = useCallback(
    entries => {
      const target = entries[0]
      if (target.isIntersecting && page < totalPages && !loading) {
        setPopularMovies(prev => [...prev, ...prefetchedMovies])
        setPrefetchedMovies([])
        setPage(prevPage => prevPage + 1)
      }
    },
    [page, totalPages, loading, prefetchedMovies]
  )

  useEffect(() => {
    const observer = new IntersectionObserver(handleObserver, {
      root: null,
      rootMargin: '200px',
      threshold: 1.0
    })
    if (observerRef.current) observer.observe(observerRef.current)
    return () => {
      if (observerRef.current) observer.unobserve(observerRef.current)
    }
  }, [handleObserver])

  useEffect(() => {
    prefetchMovies()
  }, [page, prefetchMovies])

  const filterRef = useRef()

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        filterRef.current.classList.add('scrolled')
      } else {
        filterRef.current.classList.remove('scrolled')
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  if (error) {
    return <Error error={error} />
  }

  return (
    <div className='min-h-screen text-white py-20 px-4 sm:px-8 lg:px-8'>
      <button
        className='fixed md:hidden bottom-14 right-4 bg-blue-500 text-white p-4 rounded-full z-50 mobile-filter-btn'
        onClick={() => setShowFilters(!showFilters)}
      >
        <FaFilter />
      </button>
      <div
        ref={filterRef}
        className={`mobile-filter-popup md:visible  ${
          showFilters ? 'visible' : 'hidden'
        } md:visible`}
      >
        <button
          className='absolute top-14 right-4 bg-red-500 text-white p-2 md:hidden rounded-full'
          onClick={() => setShowFilters(false)}
        >
          <FaTimes />
        </button>
        <div className='flex flex-col h-10 lg:flex-row items-center justify-between mb-10 space-y-4 lg:space-y-0 sm:px-20'>
          <div className='flex type flex-wrap items-center gap-4'>
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

          <div className='flex flex-wrap items-center time gap-4'>
            {['day', 'week'].map(window => (
              <button
                key={window}
                onClick={() => setTimeWindow(window)}
                className={`px-4 py-2 rounded-full ${
                  timeWindow === window
                    ? `${
                        window === 'day' ? 'bg-red-500' : 'bg-orange-500'
                      } text-white`
                    : 'bg-gray-700 text-gray-300'
                } hover:bg-${
                  window === 'day' ? 'red' : 'orange'
                }-600 transition-colors`}
              >
                {window === 'day' ? 'Daily' : 'Weekly'}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className='sm:px-20 sm:py-14 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-5 sm:gap-y-8'>
        {popularMovies
          .filter(movie => movie.poster_path)
          .map(movie => (
            <ShowCard
              key={movie.id}
              show={movie}
              type={3}
              mediaType={mediaType}
              className='show-card smooth-animation'
            />
          ))}
      </div>
      {loading && <Loader_ />} {/* Show loader when fetching new data */}
      <div ref={observerRef} className='h-10'></div>
    </div>
  )
}

export default PopularPage
