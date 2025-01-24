import { useState } from 'react'
import { BiChevronLeft, BiChevronRight } from 'react-icons/bi'

const SeasonScroller = ({ allSeasons, selectedSeason, handleSeasonSelect }) => {
  const [currentIndex, setCurrentIndex] = useState(0) // Tracks the start of the visible items

  const visibleItems = 5 // Number of items to show at a time
  const maxIndex = allSeasons.length - visibleItems // Maximum starting index

  const shiftItems = direction => {
    if (direction === 'left' && currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
    } else if (direction === 'right' && currentIndex < maxIndex) {
      setCurrentIndex(currentIndex + 1)
    }
  }

  return (
    <div className='relative'>
      <div className='flex justify-center items-center gap-6 max-w-[75rem] mx-auto'>
        <button
          onClick={() => shiftItems('left')}
          className={` bg-gray-400/50 backdrop-blur hover:bg-gray-300/70 duration-150 text-white p-3 rounded-full z-10 group ${
            currentIndex === 0 ? 'opacity-0 pointer-events-none' : ''
          }`}
        >
          <BiChevronLeft
            size={24}
            className='group-hover:-translate-x-1 duration-150'
          />
        </button>
        {allSeasons
          .slice(currentIndex, currentIndex + visibleItems)
          .map(season => (
            <div
              key={season.id}
              onClick={() => handleSeasonSelect(season.season_number)}
              className={`group relative block overflow-hidden rounded-[15px] duration-200 shadow-lg border cursor-pointer ${
                selectedSeason
                  ? selectedSeason === season.season_number.toString()
                    ? 'border-white'
                    : 'border-white/20'
                  : ''
              }`}
            >
              <img
                src={
                  season.poster_path
                    ? `https://image.tmdb.org/t/p/w300${season.poster_path}`
                    : 'https://via.placeholder.com/150x225?text=No+Image'
                }
                alt={season.name}
                className='object-cover transition-transform duration-300 h-72 group-hover:scale-105 rounded-[15px]'
              />
              <div
                className={`absolute inset-0 bg-black/60 flex flex-col justify-end p-4 px-2 transition-opacity backdrop-blur-sm duration-300 ${
                  selectedSeason
                    ? selectedSeason === season.season_number.toString()
                      ? 'opacity-0'
                      : 'group-hover:opacity-100'
                    : ''
                }`}
              >
                <h3 className='text-lg font-bold text-white'>{season.name}</h3>
                {season.overview && (
                  <p className='text-xs text-gray-300 mt-1'>
                    {season.overview?.slice(0, 83)}...
                  </p>
                )}
                <div className='mt-2 text-xs text-gray-400 space-y-1'>
                  <p>
                    Episodes:{' '}
                    <span className='text-yellow-500 font-medium'>
                      {season.episode_count}
                    </span>
                  </p>
                  {season.vote_average ? (
                    <p>
                      Rating:{' '}
                      <span className='text-yellow-500 font-medium'>
                        {season.vote_average}
                      </span>
                    </p>
                  ) : (
                    ''
                  )}
                  <p>
                    Year:{' '}
                    <span className='text-yellow-500 font-medium'>
                      {season.air_date?.slice(0, 4)}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          ))}
        <button
          onClick={() => shiftItems('right')}
          className={` bg-gray-400/50 backdrop-blur hover:bg-gray-300/70 duration-150 text-white p-2 px-3 rounded-full z-10 ${
            currentIndex === maxIndex ? 'opacity-0 pointer-events-none' : ''
          }`}
        >
          <BiChevronRight
            size={24}
            className='group-hover:-translate-x-1 duration-150'
          />
        </button>
      </div>

      {/* Left Button */}

      {/* Right Button */}
    </div>
  )
}

export default SeasonScroller
