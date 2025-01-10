/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react'
import { CSSTransition, TransitionGroup } from 'react-transition-group'
import { movieGenre, tvGenre } from '../constants'

const Genre = ({ genres, setSort, setYear, setGenres, type, sort, year }) => {
  const [genre, setGenre] = useState('')

  const handleSortChange = event => setSort(event.target.value)
  const handleGenreChange = event => setGenre(event.target.value)
  const handleYearChange = event => setYear(event.target.value)

  const removeGenre = genreToRemove => {
    setGenres(genres.filter(g => g !== genreToRemove))
  }
  const genre_ = type === 'movie' ? movieGenre : tvGenre

  useEffect(() => {
    if (genre && !genres.includes(genre)) {
      setGenres([genre, ...genres])
    }
  }, [genre])

  return (
    <div className='my-8'>
      <div className='p-4 sm:p-6 rounded-lg flex flex-col sm:flex-row sm:justify-between items-start sm:items-center space-y-4 sm:space-y-0 ring-1'>
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
              <option value='first_air_date'>Newest to Oldest</option>
              <option value='release_date.asc'>Oldest to Newest</option>
              <option value='vote_count.desc'>Most Watched</option>
              <option value='vote_count.asc'>Least Watched</option>
              <option value='original_title.asc'>Alphabetical (A-Z)</option>
              <option value='original_title.desc'>Alphabetical (Z-A)</option>
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

          <div className='flex flex-col mb-4 sm:mb-0'>
            <label htmlFor='year' className='text-white text-sm mb-2'>
              Year:
            </label>
            <input
              type='number'
              id='year'
              value={year}
              onChange={handleYearChange}
              className='p-2 rounded-lg bg-gray-900 text-white border border-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-900 w-full sm:w-auto'
              placeholder='Enter Year'
            />
          </div>
        </div>
      </div>

      {genres.length > 0 && (
        <div className='my-6 md:flex items-center justify-end duration-200 overflow-x-scroll div'>
          <TransitionGroup className='flex'>
            {genres.map((genre, i) => (
              <CSSTransition key={i} timeout={300} classNames='fade'>
                <div className='bg-gray-900 text-white border-blue-900/50 border rounded-full flex justify-between items-center p-2 gap-2 py-0 duration-200 ml-2'>
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
  )
}

export default Genre
