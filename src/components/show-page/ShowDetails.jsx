/* eslint-disable react/prop-types */
import { useParams } from 'react-router-dom'
import { handleAddItem } from '../../utils/firebaseHandlers'
import { FaCheck, FaHeart, FaStar, FaStarHalfAlt } from 'react-icons/fa'
import UserContext from '../../UserContext'
import { useContext } from 'react'
import { BiCheckCircle } from 'react-icons/bi'

const ShowDetails = ({ content }) => {
  const { type } = useParams()
  const { user } = useContext(UserContext)
  return (
    <div className='p-4 sm:p-6 md:p-10 lg:p-20 grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-10'>
      <div className='flex justify-center md:justify-start'>
        <img
          src={`https://image.tmdb.org/t/p/original${content.poster_path}`}
          alt={`${content.title || content.name} Poster`}
          className='w-64 sm:w-80 rounded-lg shadow-lg'
        />
      </div>

      <div className='col-span-2 space-y-4'>
        <h2 className='text-2xl sm:text-3xl font-bold '>Overview</h2>
        <p className='text-sm sm:text-base'>{content.overview}</p>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4 text-sm sm:text-base'>
          <div>
            <p>
              <span className='font-semibold text-slate-500'>
                Release Date:
              </span>{' '}
              {content.release_date || content.first_air_date}
            </p>
            {content.runtime ? (
              <p>
                <span className='font-semibold text-slate-500'>Runtime:</span>{' '}
                {type === 'movie'
                  ? `${
                      content.runtime || content.episode_run_time
                        ? `${(content.runtime / 60).toFixed(0)} h ${
                            content.runtime % 60
                          } m`
                        : 'N/A'
                    }`
                  : content.episode_run_time > 60
                  ? `${(content.episode_run_time / 60).toFixed(0)} h ${
                      content.episode_run_time % 60
                    } m / episode`
                  : `${content.episode_run_time} m / episode`}
              </p>
            ) : (
              ''
            )}
            <p>
              <span className='font-semibold text-slate-500'>Genres:</span>{' '}
              {content.genres.map(genre => genre.name).join(',  ')}
            </p>
            <p className='flex items-center'>
              <span className='font-semibold text-slate-500'>Rating:</span>{' '}
              <span className='flex items-center ml-2'>
                {Array.from({ length: 5 }, (_, i) => {
                  const starRating = (content.vote_average / 2).toFixed(1)
                  const fullStars = Math.floor(starRating)
                  const hasHalfStar = starRating - fullStars >= 0.5

                  if (i < fullStars) {
                    return <FaStar key={i} className='text-yellow-400' />
                  } else if (i === fullStars && hasHalfStar) {
                    return <FaStarHalfAlt key={i} className='text-yellow-400' />
                  } else {
                    return <FaStar key={i} className='text-gray-500' />
                  }
                })}
                <span className='ml-2'>
                  {(content.vote_average / 2).toFixed(1)} / 5
                </span>
              </span>
            </p>
          </div>
          <div>
            {content.budget ? (
              <p>
                <span className='font-semibold text-slate-500'>Budget:</span> $
                {content.budget.toLocaleString()}
              </p>
            ) : (
              ''
            )}
            {content.revenue ? (
              <p>
                <span className='font-semibold text-slate-500'>Revenue:</span> $
                {content.revenue.toLocaleString()}
              </p>
            ) : (
              ''
            )}
            <p>
              <span className='font-semibold text-slate-500'>Status:</span>{' '}
              {content.status === 'Ended'
                ? content.status + '  ' + content.last_air_date
                : content.status}
            </p>
            <p>
              <span className='font-semibold text-slate-500'>
                Original Language:
              </span>{' '}
              {content.original_language}
            </p>
            {type === 'series' && (
              <>
                <p>
                  <span className='font-semibold text-slate-500'>
                    Number of Seasons:
                  </span>{' '}
                  {content.number_of_seasons}
                </p>
                <p>
                  <span className='font-semibold text-slate-500'>
                    Number of Episodes:
                  </span>{' '}
                  {content.number_of_episodes}
                </p>
              </>
            )}
          </div>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-1 gap-4 text-sm sm:text-lg'>
          <div className='flex flex-col gap-4'>
            <div className='flex flex-col sm:flex-row sm:items-center mt-4 items-start gap-4'>
              {content.homepage && (
                <div>
                  <a
                    href={content.homepage}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='underline decoration-2 text-white p-2 py-1 rounded-lg shadow-md transition duration-200'
                  >
                    Official Website
                  </a>
                </div>
              )}

              <div className='flex flex-col gap-3 items-center'>
                <button
                  className='bg-blue-600 hover:bg-blue-700 text-white p-2 py-1 rounded-lg shadow-md transition duration-200 flex items-center'
                  type='button'
                  onClick={() =>
                    handleAddItem(content.id, type, user, 'watchList')
                  }
                >
                  <span className='mr-2'>Add to Watch List</span>
                  <BiCheckCircle />
                </button>
              </div>
            </div>
            <div>
              <button
                className='bg-red-500 hover:bg-red-600 text-white p-2 rounded-full shadow-md transition duration-200'
                title='Add to favorites'
                onClick={() =>
                  handleAddItem(content.id, type, user, 'favorite')
                }
              >
                <FaHeart className='w-3 h-3' />
              </button>
              <button
                className='bg-slate-500 ml-3 hover:bg-slate-600 text-white  p-2 rounded-full shadow-md transition duration-200'
                title='Mark as watched'
                onClick={() => handleAddItem(content.id, type, user, 'watched')}
              >
                <FaCheck className='w-3 h-3' />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ShowDetails
