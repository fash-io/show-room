/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { FaCheck, FaHeart, FaStar, FaStarHalfAlt } from 'react-icons/fa'
import UserContext from '../../UserContext'
import { useContext } from 'react'
import { BiCheckCircle, BiLink } from 'react-icons/bi'
import { storeItem } from '../../utils/firebase-storage'
import axios from 'axios'
import { options } from '../../utils/api'

const ShowDetails = ({ content, directors }) => {
  const { type } = useParams()
  const { user } = useContext(UserContext)
  const [watchProviders, setWatchProviders] = useState([])
  const [providerType, setProviderType] = useState('rent')

  useEffect(() => {
    const fetchWatchProviders = async () => {
      try {
        const tmdbId = content.id

        const response = await axios.get(
          `https://api.themoviedb.org/3/${
            type === 'movie' ? 'movie' : 'tv'
          }/${tmdbId}/watch/providers?`,
          options
        )
        const providers = response.data.results.US
        if (providers) {
          setWatchProviders(providers)
        }
      } catch (error) {
        console.error('Error fetching watch providers:', error)
      }
    }

    fetchWatchProviders()
  }, [content, type])
  useEffect(() => {
    setProviderType(
      watchProviders.flatrate?.length > 0
        ? 'flatrate'
        : watchProviders.rent?.length > 0
        ? 'rent'
        : watchProviders.buy?.length > 0
        ? 'buy'
        : ''
    )
  }, [watchProviders])

  const calculateStarRating = voteAverage => {
    const starRating = (voteAverage / 2).toFixed(1)
    const fullStars = Math.floor(starRating)
    const hasHalfStar = starRating - fullStars >= 0.5

    return { fullStars, hasHalfStar }
  }

  const { fullStars, hasHalfStar } = calculateStarRating(content.vote_average)

  return (
    <div className='sm:p-6 px-6 pb-6 md:p-10 lg:p-20 grid grid-cols-1 md:grid-cols-3 gap-8 text-gray-100'>
      <div className='hidden sm:flex justify-center w-full md:justify-start px-4'>
        <img
          src={`https://image.tmdb.org/t/p/original${content.poster_path}`}
          alt={`${content.title || content.name} Poster`}
          className='w-64 sm:w-80 rounded shadow-md hover:shadow-xl transition duration-300'
        />
      </div>

      <div className='col-span-1 md:col-span-2 space-y-6'>
        <h2 className='text-3xl font-semibold text-gray-50 max-sm:hidden'>
          {content.title || content.name}
        </h2>
        <p className='text-base leading-relaxed text-gray-300'>
          {content.overview}
        </p>

        <div className='grid grid-cols-2 sm:grid-cols-2 gap-0.5 sm:gap-6 text-[13px] sm:text-base'>
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
                    }min`
                  : `${content.episode_run_time} min/episode`}
              </p>
            )}
            <p>
              <span className='font-medium text-gray-400'>Genres:</span>{' '}
              {content.genres.map(genre => (
                <Link
                  key={genre.id}
                  to={`/shows/${
                    type === 'movie'
                      ? 'movies'
                      : type === 'tv'
                      ? 'series'
                      : type
                  }?with_genres=${genre.id}`}
                  className='text-sm ml-1 hover:text-gray-200'
                >
                  {genre.name},
                </Link>
              ))}
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
            {directors && directors[0] && (
              <p className=''>
                <span className='font-medium text-gray-400'>Director: </span>
                <Link className='' to={`/person/${directors[0]?.id}`}>
                  {directors[0]?.name}
                </Link>
              </p>
            )}
          </div>

          <div>
            {content.budget ? (
              <p>
                <span className='font-medium text-gray-400'>Budget:</span> $
                {content.budget.toLocaleString()}
              </p>
            ) : (
              ''
            )}
            {content.revenue ? (
              <p>
                <span className='font-medium text-gray-400'>Revenue:</span> $
                {content.revenue.toLocaleString()}
              </p>
            ) : (
              ''
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

        <div className='flex sm:flex-row flex-col gap-3 items-start justify-between w-full  '>
          <div className='flex flex-wrap gap-4 text-sm max-sm:w-full'>
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
              onClick={() =>
                storeItem(user.uid, { id: content.id, type: type }, 'watchList')
              }
              className='bg-green-700 hover:bg-green-800 text-white p-2 rounded-full shadow-md flex items-center gap-2 transition duration-300'
            >
              <BiCheckCircle />
            </button>
            <button
              onClick={() =>
                storeItem(user.uid, { id: content.id, type: type }, 'favorite')
              }
              className='bg-red-600 hover:bg-red-700 text-white p-2 rounded-full shadow-md transition duration-300 flex items-center gap-2'
            >
              <FaHeart />
            </button>
            <button
              onClick={() =>
                storeItem(user.uid, { id: content.id, type: type }, 'watched')
              }
              className='bg-gray-700 hover:bg-gray-800 text-white p-2 rounded-full shadow-md transition duration-300 flex items-center gap-2'
            >
              <FaCheck />
            </button>
          </div>
          <div className='max-sm:w-full w-1/2'>
            <div className='flex gap-4 items-center'>
              <h3 className='text-lg font-semibold text-gray-50'>
                Watch Providers:
              </h3>
              <div className='space-x-2'>
                <button
                  className={`${
                    providerType === 'flatrate'
                      ? 'underline font-bold'
                      : 'text-gray-400'
                  }`}
                  onClick={() =>
                    setProviderType(prev => prev !== 'flatrate' && 'flatrate')
                  }
                >
                  Stream
                </button>
                <button
                  className={`${
                    providerType === 'rent'
                      ? 'underline font-bold'
                      : 'text-gray-400'
                  }`}
                  onClick={() =>
                    setProviderType(prev => prev !== 'rent' && 'rent')
                  }
                >
                  Rent
                </button>

                <button
                  className={`${
                    providerType === 'buy'
                      ? 'underline font-bold'
                      : 'text-gray-400'
                  }`}
                  onClick={() =>
                    setProviderType(prev => prev !== 'buy' && 'buy')
                  }
                >
                  Buy
                </button>
              </div>
            </div>

            <div className='flex flex-wrap gap-4 mt-2'>
              {watchProviders[providerType]?.length > 0 ? (
                watchProviders[providerType]?.map(provider => (
                  <span
                    key={provider.provider_id}
                    href={provider.link || '#'}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='group relative'
                  >
                    <img
                      src={`https://www.themoviedb.org/t/p/w92${provider.logo_path}`}
                      alt={provider.name}
                      className='w-12 h-12 object-contain rounded-[8px] hover:-translate-y-1 hover:scale-110 duration-200 block'
                    />
                    <span className='absolute opacity-0 group-hover:opacity-100 left-1/2 transform -translate-x-1/2 top-[100%] mb-2 w-max px-3 py-2 bg-black text-white text-xs rounded-md shadow-lg transition-all duration-300'>
                      {provider.provider_name}
                    </span>
                  </span>
                ))
              ) : (
                <p className='text-gray-400'>No watch providers available</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ShowDetails
