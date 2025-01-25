/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react'
import {
  BiChevronDown,
  BiChevronLeft,
  BiChevronRight,
  BiZoomIn
} from 'react-icons/bi'
import Loader_ from '../Loaders/Loader_'
import Dropdown from './Dropdown'
import ShowGallery from '../show-page/ShowGallery'
import GalleryModal from '../GalleryModal'
import { fetchData } from '../../utils/tmdbfetch'

const SeasonTable = ({
  episodes,
  selectedSeason,
  id,
  loading,
  handleSeasonSelect,
  allSeasons,
  seasonDetails
}) => {
  const [galleryModal, setGalleryModal] = useState(false)
  const [selectedData, setSelectedData] = useState(null)
  const [imageLoading, setImageLoading] = useState(false)
  const [expandedEpisode, setExpandedEpisode] = useState(null)
  const [images, setImages] = useState([])

  useEffect(() => {
    const dataProps = {
      url: `https://api.themoviedb.org/3/tv/${id}/season/${selectedSeason}/episode/${expandedEpisode}/images`,
      setData: setImages,
      single: true,
      setLoading: setImageLoading
    }
    expandedEpisode && fetchData(dataProps)
  }, [expandedEpisode, id, selectedSeason])

  useEffect(() => {
    setExpandedEpisode(null)
  }, [selectedSeason])

  const closeModal = () => {
    setSelectedData(null)
  }

  const handleClick = dataPath => {
    setSelectedData(dataPath)
  }
  const toggleEpisodeDetails = episodeId => {
    setExpandedEpisode(prev => (prev === episodeId ? null : episodeId))
  }

  return (
    <div className='mt-10 sm:max-w-6xl sm:mx-auto p-4 bg-[#1a1a1a] rounded-xl relative mx-2 overflow-hidden'>
      {loading ? (
        <div className='w-full h-full absolute inset-1 flex justify-center items-center'>
          <Loader_ />
        </div>
      ) : (
        <>
          <div className='md:flex justify-between items-center mb-6'>
            <div className='text-sm space-y-2 w-full md:w-2/3'>
              <h2 className='text-2xl md:text-3xl font-bold text-white'>
                {seasonDetails.name || `Season ${selectedSeason}`}
              </h2>
              <p className='text-gray-400'>{seasonDetails.overview}</p>
            </div>
            <div className='flex gap-4 mt-4 md:mt-0'>
              <img
                src={
                  seasonDetails.poster_path
                    ? `https://image.tmdb.org/t/p/w300${seasonDetails.poster_path}`
                    : 'https://via.placeholder.com/150x225?text=No+Image'
                }
                alt=''
                className='h-36 md:h-44 rounded'
              />
              <div className='text-xs text-gray-400 space-y-1'>
                <p>
                  Episodes:{' '}
                  <span className='text-yellow-500 font-medium'>
                    {seasonDetails.episodes?.length}
                  </span>
                </p>
                {seasonDetails.vote_average && (
                  <p>
                    Rating:{' '}
                    <span className='text-yellow-500 font-medium'>
                      {seasonDetails.vote_average}
                    </span>
                  </p>
                )}
                <p>
                  Year:{' '}
                  <span className='text-yellow-500 font-medium'>
                    {seasonDetails.air_date?.slice(0, 4)}
                  </span>
                </p>
              </div>
            </div>
          </div>

          {/* Main Content Section */}
          <div className='grid grid-cols-12 gap-6'>
            <div className='col-span-12 lg:col-span-9'>
              {episodes.map((episode, i) => (
                <div key={episode.id} className='border-gray-700'>
                  <div
                    className='flex justify-between items-center py-3 px-2 border-b border-gray-700 cursor-pointer'
                    onClick={() => toggleEpisodeDetails(i + 1)}
                  >
                    <h3 className='text-lg font-semibold'>
                      Episode {episode.episode_number}:{' '}
                      <span>{episode.name}</span>
                    </h3>
                    <button className='text-gray-400 hover:text-white'>
                      <BiChevronDown size={24} />
                    </button>
                  </div>
                  <div
                    className={`mt-2 transition-[height] duration-300 ease-out px-3 ${
                      expandedEpisode === i + 1
                        ? 'max-sm:h-56 h-40'
                        : 'h-0 overflow-hidden'
                    }`}
                  >
                    <p className='text-gray-300'>{episode.overview}</p>
                    <div className='flex gap-4 sm:items-center bg-black/80 p-2 rounded mt-3 flex-col sm:flex-row'>
                      <div className='flex gap-4 items-center'>
                        <p className='text-sm text-gray-400'>
                          <span className='text-white'>Air Date: </span>
                          {episode.air_date}
                        </p>
                        <p className='text-sm text-gray-400'>
                          <span className='text-white'>Rating: </span>
                          {episode.vote_average.toFixed(1)}
                        </p>
                        <p className='text-sm text-gray-400'>
                          <span className='text-white'>Runtime: </span>
                          {episode.runtime} min
                        </p>
                      </div>
                      <Dropdown credits={episode} />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Gallery Section */}
            <div className='col-span-12 lg:col-span-3'>
              <div className='lg:sticky top-20'>
                {expandedEpisode && (
                  <>
                    <h3 className='text-xl font-bold mb-4 text-white'>
                      Episode Gallery
                    </h3>
                    <div className='grid grid-cols-1 gap-4'>
                      {imageLoading ? (
                        <Loader_ />
                      ) : (
                        <>
                          {images.stills?.slice(0, 3).map((image, index) => (
                            <div
                              key={index}
                              className='relative w-full group cursor-pointer rounded overflow-hidden'
                              onClick={() => handleClick(image)}
                            >
                              <img
                                src={`https://image.tmdb.org/t/p/w300${image.file_path}`}
                                alt={`Gallery Image ${index}`}
                                className='w-full h-auto shadow-lg'
                              />
                              <div className='absolute top-0 left-0 w-full h-full bg-black/50 opacity-0 group-hover:opacity-100 flex justify-center items-center duration-200'>
                                <BiZoomIn size={40} />
                              </div>
                            </div>
                          ))}
                          {images.stills?.length > 3 && (
                            <button
                              className='rounded bg-white/10 hover:bg-white/20 text-white py-2 w-full'
                              onClick={() => setGalleryModal(true)}
                            >
                              Show all
                            </button>
                          )}
                        </>
                      )}
                    </div>
                  </>
                )}
                <div className='w-[110%] mt-3 flex gap-0.5 text-sm'>
                  <button
                    className='group hover:underline  rounded bg-black px-2 py-1'
                    onClick={() =>
                      selectedSeason > allSeasons[0]?.season_number &&
                      handleSeasonSelect(selectedSeason - 1)
                    }
                  >
                    <BiChevronLeft
                      size={20}
                      className='group-hover:-translate-x-1 duration-150 inline group-active:animate-ping '
                    />
                    Previous season
                  </button>
                  <button
                    className='group hover:underline  rounded bg-black px-2 py-1'
                    onClick={() => {
                      selectedSeason <
                        allSeasons[allSeasons.length - 1]?.season_number &&
                        handleSeasonSelect(parseInt(selectedSeason) + 1)
                      console.log(allSeasons)
                    }}
                  >
                    Next season
                    <BiChevronRight
                      size={20}
                      className='group-hover:translate-x-1 duration-150 inline group-active:animate-ping'
                    />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
      {galleryModal && (
        <ShowGallery
          selectedType='image'
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

export default SeasonTable
