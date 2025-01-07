import { useEffect, useState, useCallback, useMemo } from 'react'
import { featured } from '../constants/index'
import '../components/poster-background/index.css'
import { options } from '../utils/api'
import Loading from '../components/Loaders/Loading'
import Error from '../components/Error'
import randomizeArray from 'randomize-array'
import { Link, useNavigate } from 'react-router-dom'
import { HiSwitchHorizontal } from 'react-icons/hi'
import { BsEyeFill, BsEyeSlash, BsMouse } from 'react-icons/bs'
import { FaRandom } from 'react-icons/fa'
import { BiHomeAlt2 } from 'react-icons/bi'
import { LuMouseOff } from 'react-icons/lu'

const PosterBackground = () => {
  const [data, setData] = useState([])
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selectedMovie, setSelectedMovie] = useState(null)
  const [resolution, setResolution] = useState('w185')
  const [selectedFeatured, setSelectedFeatured] = useState('default')
  const [isButtonVisible, setIsButtonVisible] = useState(true)
  const [orientation, setOrientation] = useState('straight')
  const [allowHover, setAllowHover] = useState(true)
  const navigator = useNavigate()
  const [tooltip, setTooltip] = useState({
    visible: false,
    content: '',
    x: 0,
    y: 0
  })

  const fetchMovies = useCallback(async () => {
    setLoading(true)
    let endpoint

    if (selectedFeatured === 'default') {
      endpoint =
        'https://api.themoviedb.org/3/trending/all/week?language=en-US&page='
    } else {
      const { type, category } = JSON.parse(selectedFeatured)
      endpoint = `https://api.themoviedb.org/3/${type}/${category}?language=en-US&page=`
    }

    try {
      const fetchPromises = Array.from({ length: 20 }, (_, i) =>
        fetch(`${endpoint}${i + 1}`, options)
          .then(response => response.json())
          .then(jsonData => jsonData.results)
      )

      const resultArrays = await Promise.all(fetchPromises)
      const allMovies = randomizeArray([].concat(...resultArrays))
      const movies = allMovies.filter(movie => movie.poster_path)

      const trimmedMovies = movies.slice(
        0,
        Math.floor(allMovies.length / 25) * 25
      )
      setData(trimmedMovies)
    } catch (err) {
      setError('Failed to load API data. Please try again later.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [selectedFeatured])

  useEffect(() => {
    fetchMovies()
  }, [fetchMovies])

  const handleMouseEnter = useCallback(
    (e, movie, i) => {
      if (allowHover) {
        setTooltip({
          visible: true,
          index: i,
          content: `${movie.title || movie.name} (${
            movie.media_type === 'movie' ? 'Movie' : 'Series'
          })`,
          x: e.clientX + 15,
          y: e.clientY + 15
        })
      } else {
        setTooltip({ visible: false, i: undefined, content: '', x: 0, y: 0 })
      }
    },
    [allowHover]
  )

  const handleMouseLeave = useCallback(() => {
    setTooltip({ visible: false, i: undefined, content: '', x: 0, y: 0 })
  }, [])

  const handleMouseMove = useCallback(
    e => {
      if (tooltip.visible) {
        setTooltip(prev => ({
          ...prev,
          x: e.clientX + 15,
          y: e.clientY + 15
        }))
      }
    },
    [tooltip.visible]
  )

  const handleRandomize = useCallback(() => {
    setData(prevData => randomizeArray(prevData))
  }, [])

  const handleHide = () => {
    setIsButtonVisible(prev => !prev)
  }

  const handleMovieClick = movie => {
    setSelectedMovie(movie)
  }

  const posterElements = useMemo(
    () =>
      data.map((movie, i) => (
        <div
          key={i}
          className={`poster-wrapper cursor-pointer  duration-200 ${
            i === tooltip.index
              ? 'z-40 brightness-110 scale-[1.8]  skew-x-[0deg] '
              : tooltip.visible
              ? `brightness-[0.7] ${
                  orientation === 'slant' ? 'skew-x-[10deg]' : ''
                }`
              : `${orientation === 'slant' ? 'skew-x-[10deg]' : ''}`
          }`}
          onMouseEnter={e => handleMouseEnter(e, movie, i)}
          onMouseLeave={handleMouseLeave}
          onClick={() => handleMovieClick(movie)}
        >
          <img
            src={`https://image.tmdb.org/t/p/${resolution}/${movie.poster_path}`}
            alt={movie.title || movie.name}
            className='poster-image object-cover'
          />
        </div>
      )),
    [
      data,
      handleMouseEnter,
      handleMouseLeave,
      tooltip.index,
      tooltip.visible,
      orientation,
      resolution
    ]
  )

  const Loader = () => (
    <div
      className='absolute top-0 z-10 bg-[rgba(20,20,20,0.9)] animate-pulse h-[150px] w-[100px]  rounded-lg flex justify-center items-center'
      style={{ animationDuration: '1.4s' }}
    ></div>
  )

  const handelOrientationChange = () => {
    const Orientation = orientation === 'slant' ? 'straight' : 'slant'
    setOrientation(Orientation)
  }

  if (loading) return <Loading />
  if (error) return <Error error={error} goHome={true} />

  return (
    <div className='poster-page'>
      <div className='flex fixed bottom-5 z-50 left-0 right-0 justify-center pointer-events-none'>
        <div
          className={`flex gap-[2px] sm:gap-2 md:pag-4 bg-black/80 lg:p-5 lg:py-3 rounded-full p-2 duration-200 hover:opacity-100 text-xs sm:text-[13px] backdrop-blur-sm pointer-events-auto ${
            !isButtonVisible && 'px-3 py-3 lg:px-3 lg:py-3 opacity-70'
          }`}
        >
          {isButtonVisible && (
            <button
              className='md:block hidden action-button duration-200 py-2'
              onClick={() => setAllowHover(prev => !prev)}
            >
              {allowHover ? <BsMouse /> : <LuMouseOff />}
            </button>
          )}
          <select
            className={`action-select transition-all duration-200 sm:text-xs text-[9px] ${
              !isButtonVisible && 'hidden'
            }`}
            value={selectedFeatured}
            onChange={e => setSelectedFeatured(e.target.value)}
          >
            <option value='default'>Trending (Default)</option>
            {featured.map((option, index) => (
              <option key={index} value={JSON.stringify(option)}>
                {option.title}
              </option>
            ))}
          </select>

          <select
            className={`action-select transition-all duration-200 sm:text-xs text-[9px] ${
              !isButtonVisible && 'hidden'
            }`}
            value={resolution}
            onChange={e => setResolution(e.target.value)}
          >
            <option value='w92'>Low Quality</option>
            <option value='w185'>Medium Quality</option>
            <option value='w342'>High Quality</option>
            <option value='w500'>Ultra Quality</option>
          </select>

          {isButtonVisible && (
            <span className='action-button py-2' onClick={() => navigator('/')}>
              <BiHomeAlt2 />
            </span>
          )}

          <button
            className={`action-button transition-all duration-200 flex items-center justify-between gap-1 ${
              !isButtonVisible && 'hidden'
            }`}
            onClick={handleRandomize}
          >
            <span className='hidden sm:block'>Randomize Images</span>
            <FaRandom />
          </button>

          <button
            className={`action-button flex items-center justify-between gap-1 transition-all duration-200 sm:w-20 ${
              !isButtonVisible && 'hidden'
            }`}
            onClick={handelOrientationChange}
          >
            <span className='hidden sm:block'>
              {orientation === 'slant' ? 'Straight' : 'Slant'}
            </span>
            <HiSwitchHorizontal
              className={`${
                orientation === 'slant' ? '-rotate-90' : 'rotate-45'
              } transition-transform duration-300`}
            />
          </button>
          <button
            className='action-button duration-200 py-2'
            onClick={handleHide}
          >
            {isButtonVisible ? <BsEyeFill /> : <BsEyeSlash />}
          </button>
        </div>
      </div>
      <div className={`poster-grid bg-black`} onMouseMove={handleMouseMove}>
        {posterElements}
        {tooltip.visible && (
          <div
            className='tooltip'
            style={{ left: `${tooltip.x}px`, top: `${tooltip.y}px` }}
          >
            {tooltip.content}
          </div>
        )}
      </div>
      {selectedMovie && (
        <div className='movie-modal'>
          <div className='modal-content'>
            <button
              className='close-button'
              onClick={() => setSelectedMovie(null)}
            >
              &times;
            </button>

            <div className='modal-image-wrapper'>
              {selectedMovie.poster_path ? (
                <div className='w-[100px] h-[150px] mx-auto relative'>
                  <img
                    src={`https://image.tmdb.org/t/p/${resolution}/${selectedMovie.poster_path}`}
                    alt={selectedMovie.title || selectedMovie.name}
                    className='modal-image mx-auto z-40 absolute top-0'
                  />
                  <Loader />
                </div>
              ) : (
                <div className='no-image'>No Image Available</div>
              )}
            </div>

            <div className='modal-details'>
              <h2>{selectedMovie.title || selectedMovie.name}</h2>
              {selectedMovie.release_date && (
                <p>Release Date: {selectedMovie.release_date}</p>
              )}
              {selectedMovie.first_air_date && (
                <p>First Air Date: {selectedMovie.first_air_date}</p>
              )}
              {selectedMovie.vote_average && (
                <p>Rating: {selectedMovie.vote_average}/10</p>
              )}
              <p>{selectedMovie.overview || 'No description available.'}</p>

              {selectedMovie.id && (
                <Link
                  to={`/${
                    selectedMovie.media_type === 'tv'
                      ? 'series'
                      : selectedMovie.media_type
                  }/${selectedMovie.id}`}
                  className='modal-link group'
                >
                  View details{' '}
                  <span className='group-hover:ml-5 duration-200 opacity-0 group-hover:opacity-100'>
                    {'⟫'}
                  </span>
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default PosterBackground
