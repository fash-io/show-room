import { useState } from 'react'
import { BiChevronLeft, BiChevronRight } from 'react-icons/bi'

const SeasonScroller = ({ allSeasons, selectedSeason, handleSeasonSelect }) => {
  const [currentIndex, setCurrentIndex] = useState(0)

  // Adjust visible items based on screen size
  const visibleItems =
    window.innerWidth >= 1024 ? 4 : window.innerWidth >= 768 ? 3 : 2
  const maxIndex = allSeasons.length - visibleItems

  const shiftItems = direction => {
    if (direction === 'left' && currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
    } else if (direction === 'right' && currentIndex < maxIndex) {
      setCurrentIndex(currentIndex + 1)
    }
  }

  return (
    <div className='relative' id='season-details'>
      <div className='flex justify-between items-center gap-1 lg:gap-6 sm:max-w-[75rem] w-full sm:mx-auto '>
        <button
          onClick={() => shiftItems('left')}
          className={`bg-gray-400/50 backdrop-blur hover:bg-gray-300/70 duration-150 text-white p-1 lg:p-3 rounded-full z-10 group active:scale-90 ${
            currentIndex === 0 ? 'opacity-0 pointer-events-none' : ''
          }`}
        >
          <BiChevronLeft
            size={24}
            className='group-hover:-translate-x-1 duration-150 group-active:animate-ping'
          />
        </button>
        <div className='flex gap-2 overflow-hidden'>
          {allSeasons
            .slice(currentIndex, currentIndex + visibleItems)
            .map(season => (
              <div
                key={season.id}
                onClick={() =>
                  handleSeasonSelect(season.season_number || season.id)
                }
                className={`group relative block overflow-hidden rounded-[15px] duration-200 shadow-lg border cursor-pointer border-white/20 ${
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
                  alt={season.name || season.title}
                  className='object-cover transition-transform duration-300 h-64 sm:h-72 lg:h-80 group-hover:scale-105 rounded-[15px]'
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
                  <h3 className='text-sm sm:text-base lg:text-lg font-bold text-white'>
                    {season.name || season.title}
                  </h3>
                  {season.overview && (
                    <p className='text-xs text-gray-300 mt-1 hidden sm:block'>
                      {season.overview?.slice(0, 83)}...
                    </p>
                  )}
                  <div className='mt-2 text-xs text-gray-400 space-y-1'>
                    {season.episode_count ? (
                      <p>
                        Episodes:{' '}
                        <span className='text-yellow-500 font-medium'>
                          {season.episode_count}
                        </span>
                      </p>
                    ) : null}
                    {season.vote_average ? (
                      <p>
                        Rating:{' '}
                        <span className='text-yellow-500 font-medium'>
                          {season.vote_average.toFixed(1)} /10
                        </span>
                      </p>
                    ) : null}
                    <p>
                      Year:{' '}
                      <span className='text-yellow-500 font-medium'>
                        {season.air_date?.slice(0, 4) ||
                          season.release_date?.slice(0, 4)}
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            ))}
        </div>
        <button
          onClick={() => shiftItems('right')}
          className={`bg-gray-400/50 backdrop-blur hover:bg-gray-300/70 duration-150 text-white p-1 lg:p-3 rounded-full z-10 group active:scale-90 ${
            currentIndex === maxIndex ? 'opacity-0 pointer-events-none' : ''
          }`}
        >
          <BiChevronRight
            size={24}
            className='group-hover:translate-x-1 duration-150 group-active:animate-ping'
          />
        </button>
      </div>
    </div>
  )
}

export default SeasonScroller
