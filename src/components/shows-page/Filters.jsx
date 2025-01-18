/* eslint-disable react/prop-types */
import { useState } from 'react'
import { BiSolidRightArrow } from 'react-icons/bi'
import { movieGenre, tvGenre } from '../../constants'

const Filters = ({
  type,
  includeAdult,
  setIncludeAdult,
  setGenres,
  genres
}) => {
  const [isModalOpen, setIsModalOpened] = useState(false)
  const genre = type === 'movies' ? movieGenre : tvGenre

  const handleGenre = genre_ => {
    setGenres(prevGenres =>
      prevGenres.some(({ id }) => id === genre_.id)
        ? prevGenres.filter(({ id }) => id !== genre_.id)
        : [...prevGenres, genre_]
    )
  }

  return (
    <div
      className={`bg-slate-900 shadow-lg ${
        isModalOpen ? 'rounded-t' : 'rounded'
      }`}
    >
      {/* Header */}
      <div
        className='flex px-4 py-4 items-center justify-between cursor-pointer text-slate-300 hover:bg-slate-800 rounded-t-md'
        onClick={() => setIsModalOpened(prev => !prev)}
      >
        <span className='font-medium text-sm'>Filters</span>
        <BiSolidRightArrow
          className={`duration-300 transform ${isModalOpen && 'rotate-90'}`}
        />
      </div>

      {/* Filters Modal */}
      {isModalOpen && (
        <div className='rounded-b w-full'>
          {/* Include Adult Content */}
          <div className='flex items-center justify-between p-4 border-y border-slate-800 text-sm'>
            <label htmlFor='adult' className='font-medium text-slate-300'>
              Include Adult Content
            </label>
            <div className='flex items-center'>
              <input
                type='checkbox'
                id='adult'
                checked={includeAdult}
                onChange={e => setIncludeAdult(e.target.checked)}
                className='ui-checkbox'
              />
            </div>
          </div>

          {/* Release Date */}
          <div className='p-4 border-y border-slate-800 space-y-4 text-sm'>
            <label className='block text-base font-medium text-slate-400 mb-2'>
              Release Date
            </label>
            <div className='space-y-3'>
              <div className='flex items-center justify-between'>
                <span className='text-slate-300'>From</span>
                <input
                  type='month'
                  className='w-32 p-2 bg-slate-800 text-slate-300 rounded border border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                />
              </div>
              <div className='flex items-center justify-between'>
                <span className='text-slate-300'>To</span>
                <input
                  type='month'
                  className='w-32 p-2 bg-slate-800 text-slate-300 rounded border border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                />
              </div>
            </div>
          </div>

          {/* Genres */}
          <div className='p-4 border-y border-slate-800 space-y-3'>
            <label className='text-sm font-semibold text-slate-400'>
              Genres
            </label>
            <div className='flex flex-wrap gap-3'>
              {genre.map(({ id, name }) => {
                const isSelected = genres.some(genre => genre.id === id)
                return (
                  <span
                    key={id}
                    onClick={() => handleGenre({ id, name })}
                    className={`px-4 py-1.5 text-sm rounded-full border cursor-pointer transition-colors 
                    ${
                      isSelected
                        ? 'bg-blue-600 text-white border-blue-600 shadow-md hover:bg-blue-700'
                        : 'bg-transparent text-slate-300 border-slate-600 hover:bg-slate-800 hover:border-slate-400'
                    }`}
                  >
                    {name}
                  </span>
                )
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Filters
