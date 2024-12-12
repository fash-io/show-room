import { Link } from 'react-router-dom'
import LazyLoader from './LazyLoader'

const ShowCard = props => {
  const { show, type_, type, mediaType } = props

  if (type === 1) {
    return (
      <Link
        key={show.id}
        to={`/${type_ === 'movie' ? 'movie' : 'series'}/${show.id}`}
        className='flex flex-col justify-between items-center rounded-lg overflow-hidden transform sm:hover:scale-105 sm:transition-transform sm:duration-300 h-auto'
        aria-label={show.name || show.title}
      >
        <LazyLoader
          src={`https://image.tmdb.org/t/p/w500${show.backdrop_path}`}
          alt={show.name || show.title}
          className='w-full object-cover sm:group-hover:scale-105 sm:transition-transform sm:duration-300'
        />
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
        className='relative inline-block mr-3 w-[8rem] lg:w-[10rem] md:w-[9rem] overflow-hidden group duration-300 rounded-lg group'
      >
        <img
          src={`https://image.tmdb.org/t/p/w500${show.poster_path}`}
          alt={show.title || show.name || 'Movie Poster'}
          className='cursor-pointer object-cover w-full rounded-lg group-hover:scale-110 transition-transform duration-300'
        />

        <div className='absolute bottom-0 left-0 flex opacity-0 items-center justify-center p-2 text-xs text-white bg-black/70 duration-200 rounded-tr-lg group-hover:opacity-100'>
          {show.vote_average > 1 ? show.vote_average.toFixed(1) : 'N/A'}
        </div>
      </Link>
    )
  } else if (type === 3) {
    return (
      <Link
        key={show.id}
        to={`/${show.media_type === 'movie' ? 'movie' : 'series'}/${show.id}`}
        className='group bg-gray-800 rounded-lg overflow-hidden shadow-lg transition-transform transform group sm:hover:shadow-2xl w-full h-[16rem] sm:h-80'
      >
        <img
          src={`https://image.tmdb.org/t/p/w500${show.poster_path}`}
          alt={show.title || show.name}
          className='w-full h-[16rem] sm:h-80 object-cover rounded-t-lg absolute -z-10 sm:group-hover:scale-110 sm:transition-transform sm:duration-300'
        />
        <div
          className='p-4'
          style={{ textShadow: '0px 0px 5px rgba(0, 0, 0, 1)' }}
        >
          {mediaType !== 'all' ? (
            ''
          ) : (
            <p className='text-gray-100 text-sm float-right'>
              {show.media_type.toUpperCase()}
            </p>
          )}
          <p className=' text-gray-100 text-sm absolute bottom-0 left-0 w-full inset-10 bg-gradient-to-t from-[rgba(0,0,0,0.3)] to-transparent flex items-end p-2'>
            {show.release_date || show.first_air_date}
          </p>
        </div>
      </Link>
    )
  }
}

export default ShowCard
