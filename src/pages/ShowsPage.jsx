import { useState, useEffect, useCallback, useRef } from 'react'
import Slider from '../components/slider/Slider'
import { movieGenre, tvGenre } from '../constants'
import ShowCard from '../components/ShowCard'
import Pagination from '../components/Pagination'
import { options } from '../utils/api'
import { useLocation } from 'react-router-dom'
import { useWindowWidth } from '../utils/windowWidth'
import Loader_ from '../components/Loaders/Loader_'
import { CSSTransition, TransitionGroup } from 'react-transition-group'
import { fetchData } from '../utils/tmdbfetch'

const TVShowsPage = () => {
  const { pathname } = useLocation()
  const [shows, setShows] = useState([])
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [sort, setSort] = useState('popularity')
  const [genre, setGenre] = useState('')
  const [genres, setGenres] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const type_ = pathname === '/series' ? 'tv' : 'movie'
  const genre_ = type_ === 'movie' ? movieGenre : tvGenre
  const showsRef = useRef()
  const windowWidth = useWindowWidth()
  const type = windowWidth < 768 ? 3 : 1

  const fetchShows = useCallback(async () => {
    fetchData({
      url: `https://api.themoviedb.org/3/discover/${type_}?page=${page}&sort_by=${sort}.desc&vote_count.gte=${
        sort === 'popularity' ? 400 : sort === 'vote_average' ? 400 : 0
      }${genres.length > 0 ? `&with_genres=${genres.join(',')}` : ''}`,
      setData: setShows,
      setLoading: setLoading,
      setError: setError,
      setTotalPages: setTotalPages
    })
  }, [page, type_, sort, genres])

  useEffect(() => {
    fetchShows()
  }, [fetchShows])

  const handlePageChange = newPage => {
    setPage(newPage)
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }

  const handleSortChange = event => setSort(event.target.value)
  const handleGenreChange = event => setGenre(event.target.value)

  useEffect(() => {
    if (genre && !genres.includes(genre)) {
      setGenres([genre, ...genres])
    }
  }, [genre])

  const removeGenre = genreToRemove => {
    setGenres(genres.filter(g => g !== genreToRemove))
  }

  return (
    <>
      <div>
        <Slider
          height='min-h-[50vh] sm:max-h-[80vh]'
          movies={shows}
          options={options}
          type={type_}
          setLoading={setLoading}
          setError={setError}
        />
      </div>

      <div className='container min-h-screen mx-auto px-4 sm:px-6 lg:px-8 pt-20 text-white'>
        <div className='mb-8'>
          <div
            className='p-4 sm:p-6 rounded-lg flex flex-col sm:flex-row sm:justify-between items-start sm:items-center space-y-4 sm:space-y-0 ring-1 '
            ref={showsRef}
          >
            <div className='flex flex-col sm:flex-row sm:space-x-6 w-full ml-auto justify-end'>
              <div className='flex flex-col mb-4 sm:mb-0'>
                <label htmlFor='sort' className='text-white text-sm mb-2'>
                  Sort By:
                </label>
                <select
                  id='sort'
                  value={sort}
                  onChange={handleSortChange}
                  className='p-2 rounded-lg bg-gray-900 text-white border border-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-900 w-full sm:w-auto'
                >
                  <option value='popularity'>Popularity</option>
                  <option value='vote_average'>Rating</option>
                  <option value='first_air_date'>Release Date</option>
                </select>
              </div>
              <div className='flex flex-col mb-4 sm:mb-0'>
                <label htmlFor='genre' className='text-white text-sm mb-2'>
                  Genre
                </label>
                <select
                  id='genre'
                  value=''
                  onChange={handleGenreChange}
                  className='p-2 rounded-lg bg-gray-900 text-white border border-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-900 w-full sm:w-auto'
                >
                  <option value=''>Select Genre</option>
                  {genre_.map(genre => (
                    <option key={genre.id} value={genre.id}>
                      {genre.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className='flex flex-col'>
                <label htmlFor='year' className='text-white text-sm mb-2'>
                  Year:
                </label>
              </div>
            </div>
          </div>

          {genres.length > 0 && (
            <div className='my-6 md:flex items-center justify-end duration-200 overflow-x-scroll div'>
              <TransitionGroup className='flex'>
                {genres.map((genre, i) => (
                  <CSSTransition key={i} timeout={300} classNames='fade'>
                    <div className='bg-gray-900 text-white border-blue-900/50 border rounded-full flex justify-between items-center p-2 gap-2 py-0 duration-200 ml-2 '>
                      <span className='font-light whitespace-nowrap'>
                        {genre_.find(g => g.id === parseInt(genre))?.name}
                      </span>
                      <i
                        className='fa-solid fa-x text-[8px] font-extralight text-white/50 hover:text-white hover:scale-150 duration-200 cursor-pointer'
                        onClick={() => removeGenre(genre)}
                      ></i>
                    </div>
                  </CSSTransition>
                ))}
              </TransitionGroup>
            </div>
          )}
        </div>

        <div>
          <h2 className='text-center text-3xl sm:text-4xl font-bold text-slate-300 mb-10'>
            {type_ === 'movie' ? 'Movies' : 'Series'}
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
            <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5 sm:gap-y-8'>
              {shows.map(show => (
                <ShowCard key={show.id} type_={type_} show={show} type={type} />
              ))}
            </div>
          )}
          <div className='flex justify-center py-8'>
            <Pagination
              page={page}
              totalPages={totalPages}
              handlePageChange={handlePageChange}
            />
          </div>
        </div>
      </div>
    </>
  )
}

export default TVShowsPage
