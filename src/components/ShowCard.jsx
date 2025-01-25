/* eslint-disable react/prop-types */
import { Link, useLocation } from 'react-router-dom'
import LazyLoader from './Loaders/LazyLoader'
import { useWindowWidth } from '../utils/windowWidth'
import VideoPlayer from './VideoPlayer'
import { useEffect, useState } from 'react'
import { BsYoutube } from 'react-icons/bs'
import { BiSolidError } from 'react-icons/bi'
import './shows-page/topten.css'
const ShowCard = props => {
  const {
    show,
    type_,
    type,
    isPlaying,
    trailerUrl,
    onHover,
    onHoverEnd,
    i,
    disableHover
  } = props
  const windowWidth = useWindowWidth()
  const location = useLocation()
  const [isTrailerPlaying, setIsTrailerPlaying] = useState(false)

  const showTrailer =
    windowWidth > 768 &&
    (location.pathname === '/' || location.pathname.startsWith('/shows/')) &&
    type === 2 &&
    !disableHover
      ? true
      : false

  useEffect(() => {
    setIsTrailerPlaying(false)
  }, [show, isPlaying, trailerUrl])

  if (type === 1) {
    return (
      <Link
        key={show.id}
        to={`/${type_ === 'movie' ? 'movie' : 'series'}/${show.id}`}
        className='group block overflow-hidden rounded-lg shadow-lg transition duration-300 ease-in-out hover:scale-105'
        aria-label={show.name || show.title}
      >
        <div className='relative w-full h-full'>
          <LazyLoader
            src={`https://image.tmdb.org/t/p/w300${show.poster_path}`}
            alt={show.name || show.title}
            className='w-full object-cover rounded group- peer transition-transform duration-300'
          />
          <div className='py-3 text-xs  font-light text-white flex justify-between'>
            <h3 className='font-lobster max-w-[80%]'>
              {show.name || show.title}
            </h3>
            <span className='block text-yellow-500 font-medium'>
              {show.vote_average > 1 ? show.vote_average.toFixed(1) : 'N/A'} /10
            </span>
          </div>
        </div>
      </Link>
    )
  } else if (type === 2) {
    return (
      <Link
        to={`/${type_ === 'movie' ? 'movie' : 'series'}/${show.id}`}
        key={show.id}
        className={`relative inline-block min-w-[150px] max-w-[180px] overflow-hidden group duration-500 rounded-[10px] max-h-[270px] min-h-[168px] ${
          isTrailerPlaying && 'hover:md:min-w-[22rem]'
        }`}
        onMouseEnter={() => {
          showTrailer && onHover()
        }}
        onMouseLeave={() => {
          showTrailer && onHoverEnd()
        }}
      >
        <LazyLoader
          src={`https://image.tmdb.org/t/p/w500/${show.poster_path}`}
          i={i}
          alt={show.title || show.name || 'Movie Poster'}
          className='cursor-pointer object-cover h-full w-full  min-h-[168px] transition-transform duration-300'
        />
        {!showTrailer && (
          <p className='absolute bottom-0 left-0 bg-black/80 text-xs p-2 opacity-0 md:group-hover:opacity-100 duration-200 rounded-tr'>
            {show.vote_average > 1 ? show.vote_average.toFixed(1) : 'N/A'}
          </p>
        )}
        {showTrailer && (
          <>
            <div className='h-full hidden md:flex p-2 justify-end whitespace-pre-wrap absolute top-0 flex-col opacity-0 z-50 group-hover:opacity-100'>
              <div
                className='text-white text-sm'
                style={{
                  textShadow: '1px 1px 1px #000000, -1px -1px 1px #000000'
                }}
              >
                <div className='font-semibold mb-2'>
                  {show.title || show.name}
                </div>
                <p className='text-xs font-bold mb-2'>
                  {show?.overview?.length > 90
                    ? `${show?.overview?.slice(0, 90)}...`
                    : show.overview}
                </p>
                <span className='block text-yellow-500 font-medium'>
                  {show.vote_average > 1 ? show.vote_average.toFixed(1) : 'N/A'}{' '}
                  /10
                </span>
              </div>

              {isPlaying && trailerUrl ? (
                trailerUrl === 'no' ? (
                  <>
                    <div className='flex items-center justify-center bg-gradient-to-r from-gray-700 via-gray-800 to-gray-900 text-white mt-2 shadow-md rounded-full w-fit px-2'>
                      <div className='text-center'>
                        <div className='text-xs py-2 flex items-center'>
                          <BiSolidError /> No trailer found
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <div
                    className='flex items-center justify-center bg-gradient-to-r from-gray-700 via-gray-800 to-gray-900 text-white mt-2 shadow-md rounded-full w-fit px-2'
                    onClick={e => {
                      e.preventDefault()
                      setIsTrailerPlaying(true)
                    }}
                  >
                    <div className='text-center'>
                      <div className='text-xs py-2 flex items-center'>
                        <BsYoutube /> Play Trailer
                      </div>
                    </div>
                  </div>
                )
              ) : (
                <div className='bg-gradient-to-r from-gray-700 via-gray-800 to-gray-900 text-white mt-2 shadow-md rounded-full w-fit p-2'>
                  <div className='w-4 h-4 border-2 animate-spin rounded-full border-l-transparent'></div>
                </div>
              )}
              {isTrailerPlaying && <VideoPlayer trailerUrl={trailerUrl} />}
            </div>

            <p className='text-[8px] md:hidden text-white/60 mt-0.5'>
              {show.first_air_date ||
                (show.release_date && show.release_date.slice(0, 10))}
            </p>
          </>
        )}
      </Link>
    )
  } else if (type === 3) {
    return (
      <div
        key={show.id}
        className='group relative rounded overflow-hidden shadow-lg w-full'
      >
        <div className='relative w-full h-full'>
          <img
            src={`https://image.tmdb.org/t/p/w300${show.poster_path}`}
            alt={show.title || show.name}
            className='w-full h-full object-cover rounded transition-transform '
          />
          <div className='h-full w-0 duration-300 md:group-hover:w-1/2 absolute top-0 bg-blue-800/70 z-10' />
          <div className='h-full w-0 duration-300 md:group-hover:w-1/2 absolute top-0 right-0 bg-pink-800/70 z-10' />
        </div>

        <Link
          to={`/${show.media_type === 'movie' ? 'movie' : 'series'}/${show.id}`}
          className='w-full h-full absolute top-0 flex flex-col justify-end p-4 bg-gradient-to-t from-black to-transparent transition-opacity duration-500 opacity-0 md:group-hover:opacity-100 z-20'
        >
          <div className='text-sm font-semibold text-white'>
            {show.title || show.name}
          </div>
          <div className='text-white text-sm mt-2'>
            <p className='font-medium'>
              Rating:{' '}
              <span className='text-pink-600'>
                {show.vote_average > 1 ? show.vote_average.toFixed(1) : 'N/A'}
              </span>
            </p>
            {show.overview && (
              <p className='text-xs  hidden lg:block'>
                {show.overview?.length > 60
                  ? `${show.overview?.slice(0, 60)}...`
                  : show.overview}
              </p>
            )}
          </div>
        </Link>
      </div>
    )
  } else if (type === 4) {
    return (
      <div className='flex gap-4 w-full p-1  border-white/50 border-2 overflow-hidden rounded sm:rounded bg-white/10'>
        <img
          src={`https://image.tmdb.org/t/p/w300${show.poster_path}`}
          alt={show.title || show.name}
          className='sm:w-[43%]  max-sm:max-w-[30%] rounded-l-[2px] rounded-lg shadow-lg '
        />
        <div className='flex flex-col gap-0.5 py-2'>
          <h3 className='text font-semibold text-white'>
            {show.title || show.name}
          </h3>
          <p className='text-sm text-gray-400 mt-0.5'>
            {show.release_date
              ? `Released: ${new Date(show.release_date)?.getFullYear()}`
              : show.first_air_date
              ? `From: ${new Date(show.first_air_date)?.getFullYear()} - ${
                  show.status === 'Returning Series'
                    ? 'Present'
                    : new Date(show.last_air_date)?.getFullYear()
                }`
              : 'Release Date: N/A'}
          </p>
          <p className='text-sm text-gray-400 '>
            {show.runtime || show.episode_run_time?.length > 0
              ? `Runtime: ${
                  show.type === 'movie'
                    ? `${Math.floor(show.runtime / 60)}h ${
                        show.runtime % 60
                      }min`
                    : `${show.episode_run_time} min/episode`
                }`
              : 'Runtime: N/A'}
          </p>
          <p className='text-sm text-gray-400 text-wrap bg-white flex flex-wrap'>
            <span className='text-white'>Genre:</span>

            {show.genres
              ? show.genres.map(genre => (
                  <Link
                    key={genre.id}
                    to={`/shows/${
                      show.type === 'movie'
                        ? 'movies'
                        : show.type === 'tv'
                        ? 'series'
                        : show.type
                    }?with_genres=${genre.id}`}
                    className='text-sm ml-1 hover:text-gray-200'
                  >
                    {genre.name},
                  </Link>
                ))
              : 'N/A'}
          </p>
          <Link
            to={`/${show.type === 'movie' ? 'movie' : 'series'}/${show.id}`}
            className='text-pink-500 text-sm mt-2 underline hover:text-pink-400'
          >
            View Details
          </Link>
        </div>
      </div>
    )
  }
}

export default ShowCard
