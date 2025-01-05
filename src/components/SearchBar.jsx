import { useEffect, useRef, useState } from 'react'
import { useOnClickOutside } from '../useOnClickOutside'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { options } from '../utils/api'
import axios from 'axios'
import { FaSearch } from 'react-icons/fa'
import { RxCross1 } from 'react-icons/rx'

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
  const handleSearchClick = () => {
    searchRef.current.focus()
    IconRef.current.focus()
    setSearchIcon(true)
  }

  useOnClickOutside(searchRef, handleClickOutside)
  if (location.pathname.startsWith('/search')) return

  return (
    <form
      onSubmit={handleSearchSubmit}
      className='flex group duration-150 gap-1 items-center relative'
      ref={searchRef}
    >
      <input
        type='text'
        value={searchValue}
        onChange={e => setSearchValue(e.target.value)}
        onFocus={() => setSearchIcon(true)}
        className={`outline-none border-none w-0 group-focus-within:w-[180px] sm:group-focus-within:w-[250px] duration-300 ease-in-out transform rounded-xl bg-transparent focus:bg-white/80 px-2 py-[6px] focus:ring-2  text-black placeholder-transparent group-focus-within:placeholder-gray-500 text-[16px]`}
        placeholder='Search...'
        ref={IconRef}
      />

      <button type='submit' className='relative'>
        {searchIcon ? (
          <RxCross1
            className='text-black cursor-pointer absolute top-[50%] translate-y-[-50%] right-3 duration-200 transform hover:scale-125'
            onClick={() => {
              handleClickOutside()
            }}
          />
        ) : (
          <FaSearch
            className='cursor-pointer absolute top-[50%] translate-y-[-50%] right-3 duration-200 transform hover:scale-125'
            onClick={() => {
              handleSearchClick()
            }}
          />
        )}
      </button>

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
