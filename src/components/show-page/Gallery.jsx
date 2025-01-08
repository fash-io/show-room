/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react'
import ShowGallery from './ShowGallery'
import GalleryModal from './GalleryModal'
import { useParams } from 'react-router-dom'

const Gallery = ({ backdrops, videos }) => {
  const { id, type } = useParams()
  const [galleryModal, setGalleryModal] = useState(false)
  const [selectedData, setSelectedData] = useState(null)
  const [selectedType, setSelectedType] = useState('image')
  const [data, setData] = useState([])
  const [width, setWidth] = useState(window.innerWidth)

  const closeModal = () => {
    setSelectedData(null)
  }

  const handleClick = dataPath => {
    setSelectedData(dataPath)
  }

  const filteredAndSortedVideos = videos
    .filter(video => video.iso_639_1 === 'en')
    .sort((a, b) => {
      if (a.type === 'Trailer' && b.type !== 'Trailer') return -1
      if (a.type !== 'Trailer' && b.type === 'Trailer') return 1
      if (a.official === true && b.official !== true) return -1
      if (a.official !== true && b.official === true) return 1
      return 0
    })

  const sortedImages = backdrops.sort((a, b) => {
    if (a.iso_639_1 === null && b.iso_639_1 !== null) return -1
    if (a.iso_639_1 !== null && b.iso_639_1 === null) return 1
    if (a.iso_639_1 === 'en' && b.iso_639_1 !== 'en') return -1
    if (a.iso_639_1 !== 'en' && b.iso_639_1 === 'en') return 1
    return 0
  })

  useEffect(() => {
    const dataToDisplay =
      selectedType === 'image' ? sortedImages : filteredAndSortedVideos
    setData(dataToDisplay)
  }, [selectedType, backdrops, videos, id, type])

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <div>
      {backdrops.length > 0 && (
        <div className='px-4 sm:px-6 md:px-10 lg:px-20'>
          <div className='flex items-center justify-between gap-10'>
            <h2 className='text-2xl sm:text-3xl font-semibold mb-4'>Gallery</h2>
            <div className='space-x-5'>
              {videos.length > 0 && (
                <>
                  <button
                    className={`${
                      selectedType === 'image'
                        ? 'underline font-bold'
                        : 'text-white/50'
                    }`}
                    onClick={() => setSelectedType('image')}
                  >
                    Images
                  </button>
                  <button
                    className={`${
                      selectedType === 'video'
                        ? 'underline font-bold'
                        : 'text-white/50'
                    }`}
                    onClick={() => setSelectedType('video')}
                  >
                    Videos
                  </button>
                </>
              )}
            </div>
          </div>

          <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
            {data &&
              data
                .filter((_, i) => {
                  if (width > 768 && width < 1024) {
                    return i < 8
                  }
                  return i < 7
                })
                .map((data, index) => (
                  <div
                    key={index}
                    className='relative overflow-hidden w-full rounded-lg'
                  >
                    <img
                      src={
                        selectedType === 'image'
                          ? `https://image.tmdb.org/t/p/w780${data.file_path}`
                          : `https://img.youtube.com/vi/${data.key}/hqdefault.jpg`
                      }
                      alt={`Backdrop ${index + 1}`}
                      className='shadow-md cursor-pointer hover:scale-110  duration-200 max-h-48 object-cover w-full'
                      onClick={() => handleClick(data)}
                    />
                  </div>
                ))}

            {((backdrops.length > 7 && selectedType === 'image') ||
              (videos.length > 7 && selectedType === 'video')) && (
              <div
                className={`rounded-lg flex items-center justify-center duration-200 cursor-pointer ${
                  selectedType === 'image' && 'bg-white/10 hover:bg-white/20'
                }`}
                onClick={() => {
                  setGalleryModal(true)
                }}
              >
                Show all
              </div>
            )}
          </div>
        </div>
      )}

      {galleryModal && (
        <ShowGallery
          selectedType={selectedType}
          data={data}
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

export default Gallery
