/* eslint-disable react/prop-types */
import { Link, useLocation } from 'react-router-dom'
import LazyLoader from './Loaders/LazyLoader'
import { useWindowWidth } from '../utils/windowWidth'
import VideoPlayer from './show-page/VideoPlayer'
import { useEffect, useState } from 'react'
import { BsYoutube } from 'react-icons/bs'
import { BiSolidError } from 'react-icons/bi'
const ShowCard = props => {
  const { show, type_, type, isPlaying, trailerUrl, onHover, onHoverEnd } =
    props
  const windowWidth = useWindowWidth()
  const location = useLocation()
  const [isTrailerPlaying, setIsTrailerPlaying] = useState(false)
  const showTrailer =
    windowWidth > 768 && location.pathname === '/' ? true : false
  useEffect(() => {
    setIsTrailerPlaying(false)
  }, [show, isPlaying, trailerUrl])

  if (type === 1) {
    return (
      <Link
        key={show.id}
        to={`/${type_ === 'movie' ? 'movie' : 'series'}/${show.id}`}
        className='flex flex-col justify-between items-center rounded-lg overflow-hidden transform sm:hover:scale-105 sm:transition-transform sm:duration-300 h-auto'
        aria-label={show.name || show.title}
      >
        <div className='max-h-[156px] min-h-[127px] relative'>
          <LazyLoader
            src={`https://image.tmdb.org/t/p/w300${show.backdrop_path}`}
            alt={show.name || show.title}
            className='w-full object-cover sm:group-hover:scale-105 sm:transition-transform sm:duration-300'
          />
        </div>
        <div className='p-4 flex-1'>
          <h3 className='text-lg sm:text-xl font-semibold text-white mb-3'>
            {show.name || show.title}
          </h3>
          <p className='text-gray-400 text-sm mb-4'>
            {show.overview.length > 100
              ? `${show.overview.slice(0, 100)}...`
              : show.overview}
          </p>
        </div>
      </Link>
    )
  } else if (type === 2) {
    return (
      <Link
        to={`/${type_ === 'movie' ? 'movie' : 'series'}/${show.id}`}
        key={show.id}
        className={`relative inline-block md:h-[240px] mr-3 w-[7rem] lg:w-[10rem] md:w-[9rem] overflow-hidden group duration-500 rounded min-h-[168px] ${
          showTrailer && 'hover:md:w-[22rem]'
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
            <div className='h-full hidden md:flex p-2 justify-end whitespace-pre-wrap absolute top-0 flex-col opacity-0 z-50 group-hover:opacity-100 w-[22rem]'>
              <div
                className='text-white'
                style={{ textShadow: '2px 2px 4px #000000' }}
              >
                <div className='font-semibold mb-2'>
                  {show.title || show.name}
                </div>
                <p className='text-xs mb-2'>
                  {show.overview.length > 90
                    ? `${show.overview.slice(0, 90)}...`
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
                    <div className='flex items-center justify-center bg-gradient-to-r from-gray-700 via-gray-800 to-gray-900 text-white mt-2 shadow-md rounded-full w-1/3'>
                      <div className='text-center'>
                        <div className='text-xs py-2 flex items-center'>
                          <BiSolidError /> No trailer found
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <div
                    className='flex items-center justify-center bg-gradient-to-r from-gray-700 via-gray-800 to-gray-900 text-white mt-2 shadow-md rounded-full w-1/3'
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
                <div className='flex items-center justify-center bg-gradient-to-r from-gray-700 via-gray-800 to-gray-900 text-white mt-2 shadow-md rounded-full w-1/3 py-2'>
                  <div className='text-center'>
                    <div className='loader__ mb-2'></div>
                  </div>
                </div>
              )}
              {isTrailerPlaying && <VideoPlayer trailerUrl={trailerUrl} />}
            </div>

            <p className='text-[8px] md:hidden text-white/60 mt-0.5'>
              {show.first_air_date || show.release_date.slice}
            </p>
          </>
        )}
      </Link>
    )
  } else if (type === 3) {
    return (
      <div
        key={show.id}
        className='group relative rounded-lg overflow-hidden shadow-lg w-full'
      >
        <div className='relative w-full h-full'>
          <img
            src={`https://image.tmdb.org/t/p/w300${show.poster_path}`}
            alt={show.title || show.name}
            className='w-full h-full object-cover rounded-lg transition-transform '
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
              <p className='text-xs mt-1 hidden lg:block'>
                {show.overview.length > 60
                  ? `${show.overview.slice(0, 60)}...`
                  : show.overview}
              </p>
            )}
          </div>
        </Link>
      </div>
    )
  }
}

export default ShowCard
