import { useEffect, useState } from 'react'
import { BsYoutube } from 'react-icons/bs'
import { fetchTrailer } from '../../utils/tmdbfetch'
import { getLogos } from '../../utils/get-font'
import { useParams } from 'react-router-dom'

const Hero = content => {
  const [isTrailerPlaying, setIsTrailerPlaying] = useState(false)
  const [trailerUrl, setTrailerUrl] = useState('')
  const [logo, setLogo] = useState('')
  const { id, type } = useParams()

  useEffect(() => {
    try {
      fetchTrailer(
        `https://api.themoviedb.org/3/${
          type === 'series' ? 'tv' : type
        }/${id}/videos?language=en-US`,
        setTrailerUrl
      )
      getLogos(
        `https://api.themoviedb.org/3/${
          type === 'series' ? 'tv' : type
        }/${id}/images`,
        setLogo
      )
    } catch (error) {
      console.error(error)
    }
  }, [id, type])
  return (
    <div className='relative'>
      {isTrailerPlaying ? (
        <div className='relative pt-20'>
          <iframe
            src={`https://www.youtube.com/embed/${trailerUrl}?autoplay=1`}
            title='Trailer'
            width='100%'
            height='300'
            className='object-cover h-[400px] sm:h-[600px] max-h-[75vh] w-full object-top'
            aria-controls='none'
            allow='autoplay; encrypted-media'
            allowFullScreen
          />
          <span
            className='absolute right-4 top-20 xl:w-40 xl:h-20 bg-black sm:right-6 cursor-pointer flex items-center justify-center    text-white text-xl font-bold rounded-full shadow-md transition duration-300 ease-in-out'
            title='Close'
            onClick={() => setIsTrailerPlaying(false)}
          >
            &times;
          </span>
        </div>
      ) : content.content.backdrop_path ? (
        <>
          <img
            src={`https://image.tmdb.org/t/p/original${content.content.backdrop_path}`}
            alt={content.content.title || content.content.name}
            className='object-cover h-[400px] sm:h-[600px] max-h-[75vh] w-full object-top'
          />
          <div className='absolute inset-0 bg-gradient-to-t from-black to-transparent' />
          <div className='absolute bottom-10 left-5 sm:left-10 p-4 sm:p-8 space-y-4'>
            {logo ? (
              <img
                src={`https://image.tmdb.org/t/p/w500${logo}`}
                alt={content.content.title || content.content.name}
                className='w-[190px] sm:max-w-[250px] md:max-w-[350px] md:min-w-[350px] me-auto '
              />
            ) : (
              <h1 className='text-2xl'>
                {content.content.title || content.content.name}
              </h1>
            )}
            <p className='text-sm sm:text-xl italic'>
              {content.content.tagline}
            </p>
            {trailerUrl && (
              <span
                className='p-3 bg-black/70 cursor-pointer rounded-lg py-2 inline-block space-x-5 transform duration-200 hover:scale-x-110'
                onClick={() => setIsTrailerPlaying(true)}
              >
                <span>
                  <BsYoutube className='text-red-700 inline' />
                </span>
                <span>Play Trailer</span>
              </span>
            )}
          </div>
        </>
      ) : (
        <div className='h-40 flex sm:h-52 lg:justify-center pl-12 text-slate-300 items-end'>
          <div>
            <h1 className='text-2xl sm:text-4xl md:text-5xl font-bold mb-2'>
              {content.content.title || content.content.name}
            </h1>
            <p className='text-sm sm:text-xl italic'>
              {content.content.tagline}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

export default Hero
