import { useState, useEffect, useCallback } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { options } from '../utils/api'
import debounce from 'lodash.debounce'
import axios from 'axios'

const SearchPage = () => {
  const { searchQuery } = useParams()
  const navigate = useNavigate()
  const [query, setQuery] = useState(searchQuery || '')
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState([])
  const [filter, setFilter] = useState('multi')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [error, setError] = useState(null)
  const [keywordSearch, setKeywordSearch] = useState(false)

  const debouncedSearch = useCallback(
    debounce((q, f, p) => searchMovies(q, f, p), 500),
    []
  )

  const searchMovies = async (query, filter, page = 1) => {
    if (!query.trim()) return
    setLoading(true)
    setError(null)

    try {
      const response = await axios.get(
        `https://api.themoviedb.org/3/search/${filter}?query=${encodeURIComponent(
          query
        )}&include_adult=false&page=${page}`,
        options
      )

      const data = response.data
      setResults(data.results || [])
      setTotalPages(data.total_pages || 1)
      setKeywordSearch(filter === 'keyword')
    } catch (err) {
      handleFetchError(err)
    } finally {
      setLoading(false)
    }
  }

  const updateUrl = newQuery => {
    navigate(`/search/${encodeURIComponent(newQuery)}`)
  }

  const handleChange = e => {
    const newQuery = e.target.value
    setQuery(newQuery)
    setPage(1)
    debouncedSearch(newQuery, filter, 1)
    updateUrl(newQuery)
  }

  const handleSubmit = e => {
    e.preventDefault()
    searchMovies(query, filter, 1)
  }

  const handleFilterChange = e => {
    const newFilter = e.target.value
    setFilter(newFilter)
    setPage(1)
    searchMovies(query, newFilter, 1)
  }

  const handleFetchError = err => {
    console.error('Fetch error:', err)
    setError('Something went wrong. Please try again later.')
    setResults([])
    setTotalPages(1)
    setLoading(false)
  }

  useEffect(() => {
    if (query) {
      searchMovies(query, filter, page)
    }
  }, [query, filter, page])

  useEffect(() => {
    if (searchQuery) {
      setQuery(searchQuery)
      searchMovies(searchQuery, filter, 1)
    }
  }, [searchQuery])

  return (
    <div className='min-h-screen pt-20 text-white'>
      <header className='mb-6 px-20'>
        <form onSubmit={handleSubmit} className='mt-4 sm:flex items-center'>
          <input
            type='text'
            value={query}
            onChange={handleChange}
            placeholder='Search ...'
            className='w-full p-2 border border-gray-700 rounded-md bg-gray-950 placeholder-gray-400'
            aria-label='Search'
          />
          <div className='sm:flex justify-between mt-3 sm:mt-0'>
            <button
              type='submit'
              className='sm:ml-2 px-4 py-2 bg-blue-900 hover:bg-blue-950 duration-200 rounded-md w-full sm:w-auto sm:m-0 my-1'
              aria-label='Search'
            >
              Search
            </button>
            <select
              value={filter}
              onChange={handleFilterChange}
              className='sm:ml-2 px-4 py-2 bg-blue-900 hover:bg-blue-950 duration-200 rounded-md w-full sm:w-auto'
              aria-label='Select search type'
            >
              <option value='multi'>Filter Search</option>
              <option value='movie'>Movies</option>
              <option value='person'>Person</option>
              <option value='tv'>Series</option>
            </select>
          </div>
        </form>
      </header>

      {error && <div className='text-red-500 text-center'>{error}</div>}

      <main className='sm:p-10 p-6'>
        {results.length === 0 ? (
          <p className='text-center text-gray-500'>No results found.</p>
        ) : (
          <div>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8'>
              {results.map(data => (
                <Link
                  key={data.id}
                  to={`/${
                    data.media_type === 'movie' || filter === 'keyword'
                      ? 'movie'
                      : data.media_type === 'tv'
                      ? 'series'
                      : data.media_type === 'person'
                      ? 'person'
                      : filter === 'tv'
                      ? 'series'
                      : filter
                  }/${data.id}`}
                  className='flex flex-col items-center bg-gray-800 rounded-lg overflow-hidden shadow-lg sm:transform sm:hover:scale-105 sm:transition-transform sm:duration-300'
                >
                  <img
                    src={
                      data.backdrop_path ||
                      data.poster_path ||
                      data.profile_path
                        ? `https://image.tmdb.org/t/p/w500${
                            data.backdrop_path ||
                            data.poster_path ||
                            data.profile_path
                          }`
                        : 'https://via.placeholder.com/150x225?text=No+Image'
                    }
                    alt={data.name || data.title}
                    className={`${
                      !data.backdrop_path
                        ? filter === 'person'
                          ? 'object-cover'
                          : 'max-h-44'
                        : 'w-full'
                    }`}
                  />
                  <div className='p-4 w-full'>
                    <h3 className='text-2xl font-semibold text-white mb-3'>
                      {data.name || data.title}
                    </h3>
                    <p className='text-gray-400'>
                      {data.media_type === 'person'
                        ? data.known_for_department
                        : data.release_date || data.first_air_date}
                    </p>
                    <p className='text-gray-200 text-sm mb-4'>
                      {data.overview ? (
                        data.overview.length > 100 ? (
                          `${data.overview.slice(0, 100)}...`
                        ) : (
                          data.overview
                        )
                      ) : data.known_for ? (
                        <div>
                          Known for:{' '}
                          {data.known_for.map(show => (
                            <Link
                              key={show.id}
                              to={`/${
                                show.media_type === 'movie' ? 'movie' : 'series'
                              }/${show.id}`}
                            >
                              <li className='text-base sm:text-xs hover:underline underline-offset-2 duration-75 text-blue-300 hover:text-blue-500'>
                                {show.name || show.title}
                              </li>
                            </Link>
                          ))}
                        </div>
                      ) : null}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

export default SearchPage
