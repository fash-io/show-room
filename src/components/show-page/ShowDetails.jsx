/* eslint-disable react/prop-types */
import { useParams } from 'react-router-dom'
import { handleAddItem } from '../../utils/firebaseHandlers'
import { FaCheck, FaHeart, FaStar, FaStarHalfAlt } from 'react-icons/fa'
import UserContext from '../../UserContext'
import { useContext } from 'react'
import { BiCheckCircle, BiLink } from 'react-icons/bi'

const ShowDetails = ({ content }) => {
  const { type } = useParams()
  const { user } = useContext(UserContext)

  const calculateStarRating = voteAverage => {
    const starRating = (voteAverage / 2).toFixed(1)
    const fullStars = Math.floor(starRating)
    const hasHalfStar = starRating - fullStars >= 0.5

    return { fullStars, hasHalfStar }
  }

  const { fullStars, hasHalfStar } = calculateStarRating(content.vote_average)

  return (
    <div className='p-6 md:p-10 lg:p-20 grid grid-cols-1 md:grid-cols-3 gap-8 text-gray-100 rounded-lg shadow-lg'>
      {/* Poster Section */}
      <div className='flex justify-center w-full md:justify-start'>
        <img
          src={`https://image.tmdb.org/t/p/original${content.poster_path}`}
          alt={`${content.title || content.name} Poster`}
          className='w-64 sm:w-80 rounded-lg shadow-md hover:shadow-xl transition duration-300'
        />
      </div>

      <div className='col-span-1 md:col-span-2 space-y-6'>
        <h2 className='text-3xl font-semibold text-gray-50'>
          {content.title || content.name}
        </h2>
        <p className='text-base leading-relaxed text-gray-300'>
          {content.overview}
        </p>

        <div className='grid grid-cols-1 sm:grid-cols-2 gap-6'>
          <div>
            <p>
              <span className='font-medium text-gray-400'>Release Date:</span>{' '}
              {content.release_date || content.first_air_date}
            </p>
            {content.runtime && (
              <p>
                <span className='font-medium text-gray-400'>Runtime:</span>{' '}
                {type === 'movie'
                  ? `${Math.floor(content.runtime / 60)}h ${
                      content.runtime % 60
                    }m`
                  : `${content.episode_run_time} min/episode`}
              </p>
            )}
            <p>
              <span className='font-medium text-gray-400'>Genres:</span>{' '}
              {content.genres.map(genre => genre.name).join(', ')}
            </p>
            <p className='flex items-center'>
              <span className='font-medium text-gray-400'>Rating:</span>
              <span className='flex items-center ml-2'>
                {Array.from({ length: 5 }, (_, i) => {
                  if (i < fullStars)
                    return <FaStar key={i} className='text-yellow-400' />
                  if (i === fullStars && hasHalfStar)
                    return <FaStarHalfAlt key={i} className='text-yellow-400' />
                  return <FaStar key={i} className='text-gray-600' />
                })}
                <span className='ml-2'>
                  {(content.vote_average / 2).toFixed(1)} / 5
                </span>
              </span>
            </p>
          </div>

          <div>
            {content.budget && (
              <p>
                <span className='font-medium text-gray-400'>Budget:</span> $
                {content.budget.toLocaleString()}
              </p>
            )}
            {content.revenue && (
              <p>
                <span className='font-medium text-gray-400'>Revenue:</span> $
                {content.revenue.toLocaleString()}
              </p>
            )}
            <p>
              <span className='font-medium text-gray-400'>Status:</span>{' '}
              {content.status === 'Ended'
                ? `${content.status} (${content.last_air_date})`
                : content.status}
            </p>
            <p>
              <span className='font-medium text-gray-400'>
                Original Language:
              </span>{' '}
              {content.original_language.toUpperCase()}
            </p>
            {type === 'series' && (
              <>
                <p>
                  <span className='font-medium text-gray-400'>Seasons:</span>{' '}
                  {content.number_of_seasons}
                </p>
                <p>
                  <span className='font-medium text-gray-400'>Episodes:</span>{' '}
                  {content.number_of_episodes}
                </p>
              </>
            )}
          </div>
        </div>

        <div className='flex flex-wrap gap-4 text-sm'>
          {content.homepage && (
            <a
              href={content.homepage}
              target='_blank'
              rel='noopener noreferrer'
              className='bg-blue-700 hover:bg-blue-800 text-white p-2 rounded-full shadow-md transition duration-300 flex items-center gap-2'
            >
              <BiLink />
            </a>
          )}
          <button
            onClick={() => handleAddItem(content.id, type, user, 'watchList')}
            className='bg-green-700 hover:bg-green-800 text-white p-2 rounded-full shadow-md flex items-center gap-2 transition duration-300'
          >
            <BiCheckCircle />
          </button>
          <button
            onClick={() => handleAddItem(content.id, type, user, 'favorite')}
            className='bg-red-600 hover:bg-red-700 text-white p-2 rounded-full shadow-md transition duration-300 flex items-center gap-2'
          >
            <FaHeart />
          </button>
          <button
            onClick={() => handleAddItem(content.id, type, user, 'watched')}
            className='bg-gray-700 hover:bg-gray-800 text-white p-2 rounded-full shadow-md transition duration-300 flex items-center gap-2'
          >
            <FaCheck />
          </button>
        </div>
      </div>
    </div>
  )
}

export default ShowDetails
