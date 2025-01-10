import { useState, useEffect, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Slider from '../components/slider/Slider'
import ShowCard from '../components/ShowCard'
import Pagination from '../components/Pagination'
import { options } from '../utils/api'
import { useWindowWidth } from '../utils/windowWidth'
import Loader_ from '../components/Loaders/Loader_'
import { fetchData } from '../utils/tmdbfetch'
import Genre from '../components/Genre'

const TVShowsPage = () => {
  const { type } = useParams()
  const sliderType =
    type === 'movies' ? 'movie' : type === 'series' ? 'tv' : 'all'
  const navigate = useNavigate()
  const windowWidth = useWindowWidth()

  const [shows, setShows] = useState([])
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [sort, setSort] = useState('popularity')
  const [genres, setGenres] = useState([])
  const [year, setYear] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const showType = type === 'movies' ? 'movie' : type === 'series' ? 'tv' : null
  const ShowCardType = windowWidth < 768 ? 3 : 1

  const fetchShows = useCallback(async () => {
    const url = showType
      ? `https://api.themoviedb.org/3/discover/${showType}?page=${page}&sort_by=${sort}.desc&vote_count.gte=${
          sort === 'popularity' || sort === 'vote_average' ? 400 : 0
        }${genres.length > 0 ? `&with_genres=${genres.join(',')}` : ''}${
          year ? `&primary_release_year=${year}` : ''
        }`
      : `https://api.themoviedb.org/3/trending/all/week?language=en-US&page=${page}`

    fetchData({
      url,
      setData: setShows,
      setLoading: setLoading,
      setError: setError,
      setTotalPages: setTotalPages
    })
  }, [page, showType, sort, genres, year])

  useEffect(() => {
    fetchShows()
  }, [fetchShows])

  const handleTypeChange = newType => {
    navigate(`/shows/${newType}`)
  }

  return (
    <>
      <Slider
        height='max-h-[80vh] max-sm:min-h-[75vh]'
        movies={shows}
        options={options}
        type={sliderType}
        setLoading={setLoading}
        setError={setError}
      />
      <div className='container min-h-screen mx-auto px-4 sm:px-6 lg:px-8 pt-20 text-white'>
        <div className='flex justify-center space-x-4 mb-8'>
          <button
            className={`p-2 rounded-lg ${
              !type ? 'bg-yellow-500' : 'bg-gray-800'
            }`}
            onClick={() => handleTypeChange('')}
          >
            All Shows
          </button>
          <button
            className={`p-2 rounded-lg ${
              type === 'movies' ? 'bg-yellow-500' : 'bg-gray-800'
            }`}
            onClick={() => handleTypeChange('movies')}
          >
            Movies
          </button>
          <button
            className={`p-2 rounded-lg ${
              type === 'series' ? 'bg-yellow-500' : 'bg-gray-800'
            }`}
            onClick={() => handleTypeChange('series')}
          >
            Series
          </button>
        </div>
        {type && (
          <Genre
            genres={genres}
            setSort={setSort}
            setYear={setYear}
            setGenres={setGenres}
            type={type}
            sort={sort}
            year={year}
          />
        )}
        <div>
          <h2 className='text-center text-3xl sm:text-4xl font-bold text-slate-300 mb-10'>
            {type === 'movies'
              ? 'Movies'
              : type === 'series'
              ? 'Series'
              : 'All Shows'}
          </h2>
          {error ? (
            <div className='text-center text-red-500 mb-4'>
              {error}
              <button
                className='ml-3 p-2 bg-gray-900 text-white rounded-lg'
                onClick={fetchShows}
              >
                Try again
              </button>
            </div>
          ) : loading ? (
            <Loader_ />
          ) : (
            <div className='grid grid-cols-3 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5 sm:gap-y-8'>
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
          <div className='flex justify-center py-8'>
            <Pagination page={page} totalPages={totalPages} setPage={setPage} />
          </div>
        </div>
      </div>
    </>
  )
}

export default TVShowsPage
