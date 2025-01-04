import { Link } from 'react-router-dom'
import LazyLoader from './LazyLoader'
const ShowCard = props => {
  const { show, type_, type, mediaType } = props

  const Loader = () => (
    <div
      className='absolute top-0 bottom-0 -z-10 left-0 right-0 bg-[rgba(20,20,20,0.9)] animate-pulse  rounded-lg flex justify-center items-center'
      style={{ animationDuration: '1.4s' }}
    ></div>
  )

  if (type === 1) {
    return (
      <Link
        key={show.id}
        to={`/${type_ === 'movie' ? 'movie' : 'series'}/${show.id}`}
        className='flex flex-col justify-between items-center rounded-lg overflow-hidden transform sm:hover:scale-105 sm:transition-transform sm:duration-300 h-auto'
        aria-label={show.name || show.title}
      >
        <LazyLoader
          src={`https://image.tmdb.org/t/p/w300${show.backdrop_path}`}
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
        className='relative inline-block h-60 mr-3 w-[8rem] lg:w-[10rem] md:w-[9rem] overflow-hidden group duration-300 rounded-lg group'
      >
        <Loader />
        <img
          src={`https://image.tmdb.org/t/p/w300${show.poster_path}`}
          alt={show.title || show.name || 'Movie Poster'}
          className='cursor-pointer object-cover h-full w-full rounded-lg group-hover:scale-110 transition-transform duration-300'
        />

        <div className='absolute bottom-0 left-0 flex opacity-0 items-center justify-center p-2 text-xs text-white bg-black/70 duration-200 rounded-tr-lg group-hover:opacity-100'>
          {show.vote_average > 1 ? show.vote_average.toFixed(1) : 'N/A'}
        </div>
      </Link>
    )
  } else if (type === 3) {
    return (
      <div
        key={show.id}
        className='group relative rounded-lg overflow-hidden shadow-lg w-full h-[16rem] sm:h-80 perspective'
      >
        <div className='absolute top-0 left-0 w-full h-full rounded-lg shadow-md transform origin-top transition duration-700 group-hover:rotate-[50deg] z-[1]'>
          <img
            src={`https://image.tmdb.org/t/p/w500${show.poster_path}`}
            alt={show.title || show.name}
            className='w-full h-full object-cover rounded-lg'
          />
        </div>

        <Link
          className='absolute z-0 top-[44%] left-[29%] sm:top-[53%] sm:left-[31%] whitespace-pre-wrap text-white text transition-opacity duration-500 opacity-0 group-hover:opacity-100 z-10 underline text-sm'
          to={`/${show.media_type === 'movie' ? 'movie' : 'series'}/${show.id}`}
        >
          {show.title || show.name} <i className='fa fa-arrow-right    '></i>
        </Link>

        <div className='absolute bottom-0 text-white text-sm p-2 rounded-lg transition-opacity duration-500 opacity-0 group-hover:opacity-100 z-10'>
          <p className='font-medium'>
            Rating:{' '}
            <span className='text-pink-600'>
              {show.vote_average > 1 ? show.vote_average.toFixed(1) : 'N/A'}
            </span>
          </p>
          {show.overview && (
            <p className='mt-1 text-xs'>
              {show.overview.length > 60
                ? `${show.overview.slice(0, 60)}...`
                : show.overview}
            </p>
          )}
        </div>
      </div>
    )
  }
}

export default ShowCard
