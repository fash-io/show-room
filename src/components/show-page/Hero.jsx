import { useContext, useEffect, useState } from 'react'
import { BsYoutube } from 'react-icons/bs'
import { fetchTrailer } from '../../utils/tmdbfetch'
import { getLogos } from '../../utils/get-font'
import { useParams } from 'react-router-dom'
import UserContext from '../../UserContext'

const Hero = ({ content }) => {
  const { setTrailerUrl, trailerUrl } = useContext(UserContext)
  const [trailer, setTrailer] = useState('')
  const [logo, setLogo] = useState('')
  const { id, type } = useParams()

  useEffect(() => {
    try {
      fetchTrailer(type === 'series' ? 'tv' : type, content.id, setTrailer)
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
  console.log(trailer)
  console.log(trailerUrl)

  return (
    <div className='relative'>
      {content.backdrop_path ? (
        <>
          <img
            src={`https://image.tmdb.org/t/p/original${content.backdrop_path}`}
            alt={content.title || content.name}
            className='object-cover h-[400px] sm:h-[600px] max-h-[75vh] w-full object-top'
          />
          <div className='absolute inset-0 bg-gradient-to-t from-black to-transparent' />
          <div className='absolute bottom-10 left-5 sm:left-10 p-4 sm:p-8 space-y-4'>
            {logo ? (
              <img
                src={`https://image.tmdb.org/t/p/w500${logo}`}
                alt={content.title || content.name}
                className='w-[190px] sm:max-w-[250px] md:max-w-[350px] md:min-w-[350px] me-auto '
              />
            ) : (
              <h1 className='text-2xl'>{content.title || content.name}</h1>
            )}
            <p className='text-sm sm:text-xl italic'>{content.tagline}</p>
            {trailer && (
              <span
                className='p-3 bg-black/70 cursor-pointer rounded-lg py-2 inline-block space-x-5 transform duration-200 hover:scale-x-110'
                onClick={() => setTrailerUrl(trailer)}
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
              {content.title || content.name}
            </h1>
            <p className='text-sm sm:text-xl italic'>{content.tagline}</p>
          </div>
        </div>
      )}
    </div>
  )
}

export default Hero
