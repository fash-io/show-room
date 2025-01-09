/* eslint-disable react/prop-types */
import { useEffect, useRef, useState } from 'react'
import { useOnClickOutside } from '../../useOnClickOutside'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { options } from '../../utils/api'
import axios from 'axios'

const SearchBar = ({ searchIcon, setSearchIcon }) => {
  const [results, setResults] = useState([])
  const [searchValue, setSearchValue] = useState('')
  const navigate = useNavigate()
  const searchRef = useRef()
  const IconRef = useRef()
  const location = useLocation()

  const searchMovies = async () => {
    try {
      const response = await axios.get(
        `https://api.themoviedb.org/3/search/multi?query=${encodeURIComponent(
          searchValue
        )}&include_adult=false&page=1`,
        options
      )
      setResults(response.data.results || [])
    } catch (err) {
      console.error('Error fetching search results:', err)
    }
  }
  useEffect(() => {
    if (searchValue) searchMovies()
  }, [searchValue])

  const handleClickOutside = function () {
    setSearchValue('')
    setResults([])
    setSearchIcon(false)
    searchRef.current.blur()
    IconRef.current.blur()
  }

  const handleSearchSubmit = e => {
    e.preventDefault()
    if (searchValue) {
      navigate(`/search/${searchValue}`)
      handleClickOutside()
    }
  }

  const handleResultClick = () => {
    setSearchValue('')
    setResults([])
    setSearchIcon(false)
  }
  // const handleSearchClick = () => {
  //   searchRef.current.focus()
  //   IconRef.current.focus()
  //   setSearchIcon(true)
  // }

  useOnClickOutside(searchRef, handleClickOutside)
  if (location.pathname.startsWith('/search')) return

  return (
    <form
      onSubmit={handleSearchSubmit}
      className='relative group'
      ref={searchRef}
    >
      <input
        type='text'
        value={searchValue}
        onChange={e => setSearchValue(e.target.value)}
        onFocus={() => setSearchIcon(true)}
        className={`transition-all duration-300 ease-in-out pl-10 h-8 text-sm rounded-full bg-gray-800 text-white shadow-inner focus:outline-none focus:shadow-lg focus:ring-2 focus:ring-purple-500 text-[14px] 
          ${searchIcon ? 'w-44 md:w-64' : 'w-10 cursor-pointer'}`}
        placeholder='Type to search...'
        ref={IconRef}
        onFocusCapture={() => setSearchIcon(true)}
        onBlur={() => setSearchIcon(false)}
      />

      <div className='absolute top-0 left-0 w-10 h-8 flex items-center justify-center pointer-events-none'>
        <svg
          xmlns='http://www.w3.org/2000/svg'
          className='w-6 h-6 text-white'
          viewBox='0 0 512 512'
        >
          <title>Search</title>
          <path
            d='M221.09 64a157.09 157.09 0 10157.09 157.09A157.1 157.1 0 00221.09 64z'
            fill='none'
            stroke='currentColor'
            strokeMiterlimit={10}
            strokeWidth={32}
          />
          <path
            fill='none'
            stroke='currentColor'
            strokeLinecap='round'
            strokeMiterlimit={10}
            strokeWidth={32}
            d='M338.29 338.29L448 448'
          />
        </svg>
      </div>

      {results.length > 0 && searchIcon && (
        <div className='absolute top-10 min-w-[300px] -left-14 sm:left-0 max-h-96 w-full bg-black/80 overflow-y-auto rounded-lg'>
          {results.map((val, i) => (
            <Link
              className='w-full p-2 flex justify-between items-center hover:bg-gray-700 cursor-pointer'
              key={i}
              onClick={() => handleResultClick(val.media_type, val.id)}
              to={`/${val.media_type === 'tv' ? 'series' : val.media_type}/${
                val.id
              }`}
            >
              <div className='flex flex-col mr-5'>
                <span className='font-semibold'>{val.name || val.title}</span>
                <span className='text-sm text-gray-400'>
                  {val.media_type === 'tv'
                    ? 'Series'
                    : val.media_type === 'movie'
                    ? 'Movie'
                    : 'Person'}
                </span>
              </div>
              {val.poster_path || val.profile_path ? (
                <img
                  src={`https://image.tmdb.org/t/p/w200${
                    val.poster_path || val.profile_path
                  }`}
                  alt={val.name || val.title}
                  className='w-10 h-10 object-cover rounded-lg'
                />
              ) : (
                'N/A'
              )}
            </Link>
          ))}
        </div>
      )}
    </form>
  )
}

export default SearchBar
