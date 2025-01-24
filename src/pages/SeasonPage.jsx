/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import { fetchData } from '../utils/tmdbfetch'
import { BiChevronDown, BiZoomIn } from 'react-icons/bi'
import { getLogos } from '../utils/get-font'
import Loader_ from '../components/Loaders/Loader_'
import ShowGallery from '../components/show-page/ShowGallery'
import GalleryModal from '../components/GalleryModal'
import Dropdown from '../components/season-page/Dropdown'
import SeasonScroller from '../components/season-page/SeasonScroller'

const SeasonPage = ({ setError }) => {
  const { id } = useParams()
  const [searchParams, setSearchParams] = useSearchParams()
  const [showData, setShowData] = useState({})
  const [seasonDetails, setSeasonDetails] = useState({})
  const [allSeasons, setAllSeasons] = useState([])
  const [galleryModal, setGalleryModal] = useState(false)
  const [selectedData, setSelectedData] = useState(null)
  const [episodes, setEpisodes] = useState([])
  const [crew, setCrew] = useState([])
  const [images, setImages] = useState([])
  const [logo, setLogo] = useState('')
  const [expandedEpisode, setExpandedEpisode] = useState(null)
  const [loading, setLoading] = useState(false)
  const [imageLoading, setImageLoading] = useState(false)
  const selectedSeason = searchParams.get('season')

  const closeModal = () => {
    setSelectedData(null)
  }

  const handleClick = dataPath => {
    setSelectedData(dataPath)
  }
  useEffect(() => {
    const fetchShowData = async () => {
      const dataProps = {
        url: `https://api.themoviedb.org/3/tv/${id}?language=en-US`,
        setData: setShowData,
        single: true,
        setError
      }
      fetchData(dataProps)
      getLogos(`https://api.themoviedb.org/3/tv/${id}/images`, setLogo)
    }
    fetchShowData()
  }, [id, setError])

  useEffect(() => {
    if (selectedSeason) {
      const fetchSeasonDetails = async () => {
        const dataProps = {
          url: `https://api.themoviedb.org/3/tv/${id}/season/${selectedSeason}?language=en-US&append_to_response=credits`,
          setData: setSeasonDetails,
          single: true,
          setError,
          setLoading: setLoading
        }
        fetchData(dataProps)
      }
      fetchSeasonDetails()
    }
  }, [id, selectedSeason, setError])

  useEffect(() => {
    if (showData.seasons) {
      setAllSeasons(showData.seasons)
    }
    if (seasonDetails.episodes) {
      setEpisodes(seasonDetails.episodes)
    }
    if (seasonDetails.credits) {
      setCrew(seasonDetails.credits)
    }
  }, [showData, seasonDetails])

  const toggleEpisodeDetails = episodeId => {
    setExpandedEpisode(prev => (prev === episodeId ? null : episodeId))
  }
  const handleSeasonSelect = seasonNumber => {
    if (selectedSeason === seasonNumber.toString()) {
      setSearchParams({})
      window.scrollTo({ top: 0 })
    } else {
      setSearchParams({ season: seasonNumber })
      document
        .getElementById('season-details')
        .scrollIntoView({ behavior: 'smooth' })
    }
  }

  useEffect(() => {
    const dataProps = {
      url: `https://api.themoviedb.org/3/tv/${id}/season/${selectedSeason}/episode/${expandedEpisode}/images`,
      setData: setImages,
      single: true,
      setLoading: setImageLoading
    }
    expandedEpisode && fetchData(dataProps)
  }, [expandedEpisode, id, selectedSeason])

  return (
    <div className='relative text-white'>
      <div className='relative flex flex-col justify-end h-[90vh] bg-cover bg-center mb-40'>
        <img
          src={`https://image.tmdb.org/t/p/w1280${showData.backdrop_path}`}
          className='w-full h-full top-0 left-0 absolute object-cover object-bottom -z-20 rounded-b-[190px]'
          alt=''
        />
        <div className='absolute inset-0 bg-opacity-60 bg-black -z-10 rounded-b-[190px]'></div>
        <div className='flex flex-col gap-5 translate-y-20'>
          <div className='mx-auto max-w-4xl'>
            {logo ? (
              <img
                src={`https://image.tmdb.org/t/p/w500${logo}`}
                alt={showData.title || showData.name}
                className='w-[110px] sm:max-w-[250px] md:max-w-[350px] md:min-w-[350px] me-auto '
              />
            ) : (
              <h1 className='md:text-2xl'>{showData.title || showData.name}</h1>
            )}
            <p className='text-sm tracking-wider text-gray-400 mt-4 '>
              {showData.overview}
            </p>
          </div>
          <SeasonScroller
            allSeasons={allSeasons}
            selectedSeason={selectedSeason}
            handleSeasonSelect={handleSeasonSelect}
          />
        </div>
      </div>

      {/* Season Details */}
      {selectedSeason && seasonDetails && (
        <div className='mt-24 max-w-6xl min-h-96 border-white/20 border-2 mx-auto p-4 bg-[#1a1a1a] rounded-xl relative'>
          {loading ? (
            <div className='w-full h-full absolute inset-1 justify-center items-center flex'>
              <Loader_ />
            </div>
          ) : (
            <>
              <div className='flex justify-between items-center'>
                <div className='mb-6 text-sm flex gap-4 flex-col w-2/3'>
                  <h2 className='text-2xl font-bold text-white '>
                    {seasonDetails.name || `Season ${selectedSeason}`}
                  </h2>
                  <span className='text-sm tracking-wider text-gray-400 '>
                    {seasonDetails.overview}
                  </span>
                </div>
                <div className='flex gap-2 justify-center items-end w-72'>
                  <div>
                    <img
                      src={
                        seasonDetails.poster_path
                          ? `https://image.tmdb.org/t/p/w300${seasonDetails.poster_path}`
                          : 'https://via.placeholder.com/150x225?text=No+Image'
                      }
                      alt=''
                      className='h-36 rounded'
                    />
                  </div>
                  <div className='text-xs text-gray-400 space-y-1 '>
                    <p className='flex gap-2'>
                      Episodes:{' '}
                      <span className='text-yellow-500 font-medium'>
                        {seasonDetails.episodes?.length}
                      </span>
                    </p>
                    {seasonDetails.vote_average ? (
                      <p className='flex gap-2'>
                        Rating:{' '}
                        <span className='text-yellow-500 font-medium'>
                          {seasonDetails.vote_average}
                        </span>
                      </p>
                    ) : (
                      ''
                    )}
                    <p className='flex gap-2'>
                      Year:{' '}
                      <span className='text-yellow-500 font-medium'>
                        {seasonDetails.air_date?.slice(0, 4)}
                      </span>
                    </p>
                  </div>
                </div>
              </div>
              <div className='grid grid-cols-12 gap-12 mt-5 '>
                <div className='col-span-9'>
                  {episodes.map((episode, i) => (
                    <div key={episode.id} className=' border-gray-700'>
                      <div
                        className='flex justify-between items-center py-2 border-b  px-2 cursor-pointer'
                        onClick={() => toggleEpisodeDetails(i + 1)}
                      >
                        <h3 className='text-lg font-semibold font-lobster'>
                          Episode {episode.episode_number}:{' '}
                          <span className='font'>{episode.name}</span>
                        </h3>
                        <button className='text-gray-400 hover:text-white'>
                          <BiChevronDown size={24} />
                        </button>
                      </div>
                      <div
                        className={`mt-4  rounded border-gray-700 duration-300 ease-out transition-[height] px-3 ${
                          expandedEpisode === i + 1
                            ? 'h-44 '
                            : 'h-0 overflow-hidden'
                        }`}
                      >
                        <p className='text-gray-300'>{episode.overview}</p>
                        <div className='flex gap-5 bg-black/90 rounded w-fit pl-4 pr-1 justify-center py-1 mt-3 items-center '>
                          <p className='text-sm text-gray-400  *:   '>
                            <span className='text-white'>Air Date: </span>
                            {episode.air_date}
                          </p>
                          <p className='text-sm text-gray-400  *:   '>
                            <span className='text-white'>Rating: </span>
                            {episode.vote_average.toFixed(1)}
                          </p>
                          <p className='text-sm text-gray-400  *:   '>
                            <span className='text-white'>Runtime: </span>
                            {episode.runtime} min
                          </p>
                          <Dropdown credits={episode} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Episode Gallery */}
                <div className='col-span-3 relative'>
                  <div className='sticky top-32'>
                    {expandedEpisode && (
                      <>
                        <h3 className='text-xl font-bold mb-4'>
                          Episode Gallery
                        </h3>
                        <div className='grid grid-cols-1 gap-2'>
                          {imageLoading ? (
                            <Loader_ />
                          ) : (
                            <>
                              {images?.stills
                                ?.filter((_, i) => i < 3)
                                .map((image, index) => (
                                  <div
                                    key={index}
                                    className='relative w-full group cursor-pointer rounded overflow-hidden'
                                  >
                                    <img
                                      src={`https://image.tmdb.org/t/p/w300${image.file_path}`}
                                      alt={`Gallery Image ${index}`}
                                      className='w-full h-auto shadow-lg'
                                      onClick={() => handleClick(image)}
                                    />
                                    <div className='absolute top-0 h-full w-full left-0 bg-black/50 z-50 flex justify-center items-center pointer-events-none opacity-0 group-hover:opacity-100 duration-200'>
                                      <BiZoomIn size={40} />
                                    </div>
                                  </div>
                                ))}

                              {images.stills?.length > 3 && (
                                <div
                                  className={`rounded flex items-center justify-center duration-200 cursor-pointer bg-white/10 hover:bg-white/20 h-40`}
                                  onClick={() => {
                                    setGalleryModal(true)
                                  }}
                                >
                                  Show all
                                </div>
                              )}
                            </>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      )}
      {galleryModal && (
        <ShowGallery
          selectedType={'image'}
          data={images.stills}
          onClose={() => setGalleryModal(false)}
          handleClick={handleClick}
        />
      )}
      {selectedData && (
        <GalleryModal selectedData={selectedData} closeModal={closeModal} />
      )}
    </div>
  )
}

export default SeasonPage
