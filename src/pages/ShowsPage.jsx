import { useState, useEffect, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import ShowCard from '../components/ShowCard'
import Pagination from '../components/Pagination'
import { useWindowWidth } from '../utils/windowWidth'
import Loader_ from '../components/Loaders/Loader_'
import { fetchData } from '../utils/tmdbfetch'
import Genre from '../components/shows-page/Genre'

const TVShowsPage = () => {
  const { type } = useParams()
  const navigate = useNavigate()
  const windowWidth = useWindowWidth()
  const [shows, setShows] = useState([])

  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [filters, setFilters] = useState({
    include_adult: true,
    primary_release_year: '',
    sort_by: 'popularity.desc',
    with_people: '',
    with_watch_providers: '',
    with_runtime_gte: 0,
    with_runtime_lte: 300,
    with_keywords: '',
    with_original_language: ''
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const showType = type === 'movies' ? 'movie' : type === 'series' ? 'tv' : null
  const ShowCardType = windowWidth < 768 ? 3 : 1

  const fetchShows = useCallback(async () => {
    const queryParams = new URLSearchParams(filters).toString()
    const url = showType
      ? `https://api.themoviedb.org/3/discover/${showType}?${queryParams}&page=${page}`
      : `https://api.themoviedb.org/3/trending/all/week?language=en-US&page=${page}`

    fetchData({
      url,
      setData: setShows,
      setLoading: setLoading,
      setError: setError,
      setTotalPages: setTotalPages
    })
  }, [page, showType, filters])

  useEffect(() => {
    fetchShows()
  }, [fetchShows])

  const handleTypeChange = newType => {
    navigate(`/shows/${newType}`)
  }

  return (
    <div className='min-h-screen text-white'>
      <div className='max-w-[80rem] mx-auto pt-20 lg:px-2'>
        <div className='flex justify-center space-x-4 mb-8'>
          <button
            className={`p-3 rounded-md transition-all duration-300 ${
              !type ? 'bg-blue-600' : 'bg-gray-800'
            } hover:bg-blue-500`}
            onClick={() => handleTypeChange('')}
          >
            All Shows
          </button>
          <button
            className={`p-3 rounded-md transition-all duration-300 ${
              type === 'movies' ? 'bg-blue-600' : 'bg-gray-800'
            } hover:bg-blue-500`}
            onClick={() => handleTypeChange('movies')}
          >
            Movies
          </button>
          <button
            className={`p-3 rounded-md transition-all duration-300 ${
              type === 'series' ? 'bg-blue-600' : 'bg-gray-800'
            } hover:bg-blue-500`}
            onClick={() => handleTypeChange('series')}
          >
            Series
          </button>
        </div>

        <h2 className='text-center text-3xl sm:text-4xl font-bold text-slate-300 mb-10'>
          {type === 'movies'
            ? 'Movies'
            : type === 'series'
            ? 'Series'
            : 'All Shows'}
        </h2>

        <div className='grid grid-cols-10 gap-6'>
          {/* Filters Section */}
          <div className='col-span-2 sticky top-0 z-50'>
            <Genre filters={filters} type={type} setFilters={setFilters} />
          </div>

          {/* Shows Grid */}
          <div className='col-span-8'>
            {error ? (
              <div className='text-center text-red-500 mb-4'>
                {error}
                <button
                  className='ml-3 p-2 bg-gray-800 text-white rounded-md hover:bg-gray-700'
                  onClick={fetchShows}
                >
                  Try again
                </button>
              </div>
            ) : loading ? (
              <Loader_ />
            ) : (
              <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6'>
                {shows.map(show => (
                  <ShowCard
                    key={show.id}
                    type_={showType}
                    show={show}
                    type={ShowCardType}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Pagination */}
      </div>
    </div>
  )
}

export default TVShowsPage
