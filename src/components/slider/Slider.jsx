/* eslint-disable react/prop-types */
import { useState, useEffect, useRef } from 'react'
import { useSwipeable } from 'react-swipeable'
import { Link } from 'react-router-dom'
import { BiInfoCircle } from 'react-icons/bi'
import { options } from '../../utils/api'
import { fetchLogos } from '../../utils/logo-util'
import { getFontForGenres } from '../../utils/get-font'
import { fetchData } from '../../utils/tmdbfetch'
import SliderButtons from './SliderButtons'

const Slider = props => {
  const { height, type, setError, setLoading } = props
  const [currentIndex, setCurrentIndex] = useState(0)
  const [show, setShow] = useState([])
  const [logos, setLogos] = useState({})
  const sliderRef = useRef()
  const intervalRef = useRef()

  useEffect(() => {
    fetchData({
      url: `https://api.themoviedb.org/3/trending/${type}/day`,
      setData: setShow,
      setLoading: setLoading,
      setError: setError
    })
  }, [type, setError, setLoading])

  useEffect(() => {
    const fetchLogosData = async () => {
      if (show.length > 0) {
        const logosData = await fetchLogos(show, options)
        setLogos(logosData)
      }
    }

    fetchLogosData()
  }, [show])

  useEffect(() => {
    if (show.length > 0) {
      startAutoSlide()
      return () => clearInterval(intervalRef.current)
    }
  }, [show])

  const startAutoSlide = () => {
    intervalRef.current = setInterval(() => {
      goToNextSlide()
    }, 5000)
  }

  const resetAutoSlide = () => {
    clearInterval(intervalRef.current)
    startAutoSlide()
  }
  const disableAutoSlide = () => {
    clearInterval(intervalRef.current)
  }

  const goToPreviousSlide = () => {
    setCurrentIndex(prevIndex =>
      prevIndex === 0 ? show.length - 1 : prevIndex - 1
    )
    resetAutoSlide()
  }

  const goToNextSlide = () => {
    setCurrentIndex(prevIndex =>
      prevIndex === show.length - 1 ? 0 : prevIndex + 1
    )
    resetAutoSlide()
  }

  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => goToNextSlide(),
    onSwipedRight: () => goToPreviousSlide(),
    trackMouse: true
  })

  useEffect(() => {
    const handleKeyDown = event => {
      if (event.key === 'ArrowLeft') {
        goToPreviousSlide()
      } else if (event.key === 'ArrowRight') {
        goToNextSlide()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  return (
    <div className={`relative overflow-hidden z-40 ${height}`}>
      <SliderButtons onClick={goToPreviousSlide} direction={'left'} />
      <div
        ref={sliderRef}
        {...swipeHandlers}
        className='flex transition-transform duration-1000 ease-in-out'
        onMouseEnter={() => {
          disableAutoSlide()
        }}
        onMouseLeave={() => {
          startAutoSlide()
        }}
        style={{
          transform: `translateX(-${currentIndex * 100}%)`
        }}
      >
        {show.length > 0 ? (
          show.map((movie, index) => (
            <div key={index} className='min-w-full relative h-full'>
              <img
                src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
                alt={movie.title || movie.name}
                className={`w-full object-cover object-top ${height}`}
              />
              <div className='absolute w-full px-4 sm:px-6 md:px-[9%] bottom-0 text-white bg-gradient-to-t from-black via-transparent to-transparent pb-4 sm:pb-6'>
                {logos[movie.id] ? (
                  <img
                    src={`https://image.tmdb.org/t/p/w500${logos[movie.id]}`}
                    alt={movie.title || movie.name}
                    className='max-w-[200px] sm:max-w-[200px] md:max-w-[200px] min-w-[200px] me-auto mb-4'
                  />
                ) : (
                  <div className='p-3 text-3xl'>
                    <span
                      className={`text-white font-bold ml-4 ${getFontForGenres(
                        movie.genre_ids,
                        movie.media_type
                      )}`}
                    >
                      {movie.title || movie.name}
                    </span>
                  </div>
                )}

                <p
                  className='max-w-xs sm:max-w-sm md:max-w-md lg:max-w-xl text-xs sm:text-sm lg:text-base leading-5 mb-2 sm:mb-4 hidden md:block'
                  style={{ textShadow: '2px 2px 4px #000000' }}
                >
                  {movie.overview.length > 300
                    ? `${movie.overview.slice(0, 300)}...`
                    : movie.overview}
                </p>
                <p
                  className='text-xs sm:text-sm md:text-md mb-2 uppercase tracking-wider text-slate-200 font-bold'
                  style={{ textShadow: '2px 2px 4px #000000' }}
                >
                  {movie.media_type === 'movie' ? 'Movie' : 'TV Show'}
                </p>
                <div className='flex gap-2 sm:gap-3 mb-4 sm:mb-8 md:mb-12'>
                  <Link
                    to={`/${
                      movie.media_type === 'movie' ? 'movie' : 'series'
                    }/${movie.id}`}
                    className='py-1 sm:py-2 flex px-3 sm:px-4 md:px-5 items-center gap-1 sm:gap-2 md:gap-3 text-xs sm:text-sm font-semibold bg-[#6d6d6eb3] rounded cursor-pointer hover:bg-[#6d6d6e66] transition duration-200'
                  >
                    <BiInfoCircle /> More info
                  </Link>
                </div>
              </div>
            </div>
          ))
        ) : (
          <></>
        )}
      </div>

      <SliderButtons onClick={goToNextSlide} direction={'right'} />
    </div>
  )
}

export default Slider