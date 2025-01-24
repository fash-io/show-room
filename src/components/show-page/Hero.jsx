/* eslint-disable react/prop-types */
import { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { BsYoutube } from 'react-icons/bs'
import UserContext from '../../UserContext'
import { fetchTrailer } from '../../utils/tmdbfetch'
import { getLogos } from '../../utils/get-font'

const Hero = ({ content }) => {
  const { setTrailerUrl } = useContext(UserContext)
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

  return (
    <div className='relative'>
      <div className='sm:hidden absolute bottom-0 p-1 bg-amber-500 right-5 w-32 z-50'>
        <img
          src={`https://image.tmdb.org/t/p/original${content.poster_path}`}
          alt={`${content.title || content.name} Poster`}
          className='w-64 sm:w-80'
        />
      </div>
      {content.backdrop_path ? (
        <>
          <img
            src={`https://image.tmdb.org/t/p/original${content.backdrop_path}`}
            alt={content.title || content.name}
            className='object-cover h-[500px] sm:h-[600px] max-h-[75vh] w-full object-top'
          />
          <div className='absolute inset-0 bg-gradient-to-t from-black to-transparent' />
          <div className='absolute bottom-10 left-2 sm:left-10 p-1 sm:p-8 space-y-3 sm:space-x-4'>
            {logo ? (
              <img
                src={`https://image.tmdb.org/t/p/w500${logo}`}
                alt={content.title || content.name}
                className='w-[110px] sm:max-w-[250px] md:max-w-[350px] md:min-w-[350px] me-auto '
              />
            ) : (
              <h1 className='md:text-2xl'>{content.title || content.name}</h1>
            )}
            <p className='text-xs w-5/6 sm:text-sm italic'>{content.tagline}</p>
            {trailer && (
              <button
                className='py-1 sm:py-2 px-3 text-xs sm:text-sm font-semibold bg-[#6d6d6eb3] rounded hover:bg-[#6d6d6e66] transition duration-200 inline-block space-x-5'
                onClick={() => setTrailerUrl(trailer)}
              >
                <BsYoutube className='inline' />
                <span>Play Trailer</span>
              </button>
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
