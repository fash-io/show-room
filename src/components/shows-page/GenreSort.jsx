/* eslint-disable react/prop-types */
import { useState } from 'react'
import { BiSolidRightArrow } from 'react-icons/bi'
import { sortOptions } from '../../constants'

const GenreSort = ({ setSortOption, sortOption }) => {
  const [isModalOpen, setIsModalOpened] = useState(false)
  return (
    <div
      className={`bg-slate-900 shadow-lg ${
        isModalOpen ? 'rounded-t' : 'rounded'
      }`}
    >
      <div
        onClick={() => setIsModalOpened(prev => !prev)}
        className='cursor-pointer'
      >
        <div className='flex px-4 py-3 items-center justify-between'>
          <span className='text-sm font-medium text-slate-300'>Sort by</span>
          <BiSolidRightArrow
            className={`duration-300 transform ${isModalOpen && 'rotate-90'}`}
          />
        </div>
        {isModalOpen && (
          <div className='border-t border-slate-800 bg-slate-800 text-slate-200 text-xs rounded-b max-h-44 overflow-y-auto'>
            {sortOptions.map((option, i) => (
              <div
                key={i}
                onClick={() => setSortOption(option.key)}
                className={`px-4 py-2 hover:bg-slate-700 cursor-pointer ${
                  sortOption === option.key ? 'bg-slate-700' : ''
                }`}
              >
                {option.label}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default GenreSort
