/* eslint-disable react/prop-types */
import { useState, useEffect, useContext, useRef } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import { Autoplay, Pagination, Navigation } from 'swiper/modules'
import { Link } from 'react-router-dom'
import { BiInfoCircle, BiLogoYoutube } from 'react-icons/bi'
import { fetchLogos } from '../utils/logo-util'
import { fetchData, fetchTrailer } from '../utils/tmdbfetch'
import UserContext from '../UserContext'
import { movieGenre, tvGenre } from '../constants'

const Slider = ({ height, type, setError, setLoading }) => {
  const [show, setShow] = useState([])
  const [logos, setLogos] = useState({})
  const [genres, setGenres] = useState([])
  const { setTrailerUrl } = useContext(UserContext)
  const progressCircle = useRef(null)
  const progressContent = useRef(null)
  const onAutoplayTimeLeft = (s, time, progress) => {
    progressCircle.current.style.setProperty('--progress', 1 - progress)
    progressContent.current.textContent = `${Math.ceil(time / 1000)}s`
  }

  useEffect(() => {
    fetchData({
      url: `https://api.themoviedb.org/3/trending/${type}/day`,
      setData: setShow,
      setLoading: setLoading,
      setError: setError
    })
  }, [type, setError, setLoading])

  const getGenre = () => {
    const updatedGenres = show.map(item => {
      const genreType = item.media_type === 'tv' ? tvGenre : movieGenre
      const genresForItem = item.genre_ids
        .map(id => {
          const genre = genreType.find(g => g.id === id)
          return genre ? genre.name : null
        })
        .filter(genre => genre !== null)

      return { show_id: item.id, genres: genresForItem }
    })

    setGenres(updatedGenres)
  }

  useEffect(() => {
    getGenre()
  }, [type, show])

  useEffect(() => {
    const fetchLogosData = async () => {
      if (show.length > 0) {
        const logosData = await fetchLogos(show)
        setLogos(logosData)
      }
    }

    fetchLogosData()
  }, [show])

  const handleClick = dataPath => {
    fetchTrailer(dataPath.media_type, dataPath.id, setTrailerUrl)
  }

  return (
    <div className={`relative overflow-hidden z-40 ${height}`}>
      <Swiper
        spaceBetween={0}
        slidesPerView={1}
        loop={true}
        autoplay={{
          delay: 8000,
          pauseOnMouseEnter: false
        }}
        pagination={{
          dynamicBullets: true
        }}
        navigation={true}
        modules={[Autoplay, Pagination, Navigation]}
        className='h-full'
        onAutoplayTimeLeft={onAutoplayTimeLeft}
      >
        {show.map((movie, index) => (
          <SwiperSlide key={index} className='max-md:pb-5'>
            <div className='relative h-full'>
              <img
                src={`https://image.tmdb.org/t/p/original${movie?.backdrop_path}`}
                alt={movie?.title || movie?.name}
                className={`w-full object-cover md:object-top h-full ${height}`}
              />
              <div className='absolute px-[7%] bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4 space-y-1 text-white'>
                {logos[movie?.id] ? (
                  <img
                    src={`https://image.tmdb.org/t/p/w500${logos[movie?.id]}`}
                    alt={movie?.title || movie?.name}
                    className='md:max-w-[500px] md:mb-4 mx-auto md:ml-0'
                  />
                ) : (
                  <h2 className='text-2xl md:mb-4 text-center md:text-left md:ml-0 font-bold'>
                    {movie?.title || movie?.name}
                  </h2>
                )}
                <div className='text-center text-sm space-y-1 block md:hidden'>
                  <span className='text-[10px] text-white/50'>
                    {genres[index]
                      ? genres[index].genres?.join(', ')
                      : 'loading'}
                  </span>
                  <p
                    className='text-xs'
                    style={{ textShadow: '2px 2px 4px #000000' }}
                  >
                    {movie?.overview.length > 70
                      ? `${movie?.overview?.slice(0, 90)}...`
                      : movie?.overview}
                  </p>
                </div>

                <div className='mt-4 gap-4 hidden md:flex'>
                  <div className='hidden md:block'>
                    <p
                      className='max-w-xs sm:max-w-sm md:max-w-md lg:max-w-xl text-xs sm:text-sm lg:text-base leading-5 mb-2 sm:mb-4'
                      style={{ textShadow: '2px 2px 4px #000000' }}
                    >
                      {movie?.overview?.length > 300
                        ? `${movie?.overview?.slice(0, 300)}...`
                        : movie?.overview}
                    </p>
                    <p
                      className='text-xs sm:text-sm md:text-md mb-2 uppercase tracking-wider text-slate-200 font-bold'
                      style={{ textShadow: '2px 2px 4px #000000' }}
                    >
                      {movie?.media_type === 'movie' ? 'Movie' : 'TV Show'}
                    </p>
                    <div className='flex gap-2 sm:gap-3 mb-4 sm:mb-8 md:mb-12'>
                      <Link
                        to={`/${
                          movie?.media_type === 'movie' ? 'movie' : 'series'
                        }/${movie.id}`}
                        className='py-1 sm:py-2 flex px-3 sm:px-4 md:px-5 items-center gap-1 sm:gap-2 md:gap-3 text-xs sm:text-sm font-semibold bg-[#6d6d6eb3] rounded cursor-pointer hover:bg-[#6d6d6e66] transition duration-200 relative group'
                      >
                        <BiInfoCircle /> More info
                      </Link>
                      <button
                        className='py-1 sm:py-2 flex px-3 sm:px-4 md:px-5 items-center gap-1 sm:gap-2 md:gap-3 text-xs sm:text-sm font-semibold bg-[#6d6d6eb3] rounded cursor-pointer hover:bg-[#6d6d6e66] transition duration-200'
                        onClick={() => {
                          handleClick(movie)
                        }}
                      >
                        <BiLogoYoutube /> Play Trailer
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <Link
                to={`/${movie?.media_type === 'movie' ? 'movie' : 'series'}/${
                  movie?.id
                }`}
                className='block absolute inset-0 md:hidden'
              />
            </div>
          </SwiperSlide>
        ))}
        <div className='autoplay-progress' slot='container-end'>
          <svg viewBox='0 0 48 48' ref={progressCircle}>
            <circle cx='24' cy='24' r='20'></circle>
          </svg>
          <span ref={progressContent}></span>
        </div>
      </Swiper>
    </div>
  )
}

export default Slider
