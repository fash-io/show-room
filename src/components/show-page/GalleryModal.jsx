/* eslint-disable react/prop-types */
import { LuDownload, LuX } from 'react-icons/lu'

const GalleryModal = ({ selectedData, closeModal }) => {
  return (
    <div
      className='fixed inset-0 z-[1000] bg-black/90 flex justify-center items-center'
      onClick={closeModal}
    >
      <div className='relative' onClick={e => e.stopPropagation()}>
        <button
          onClick={closeModal}
          className='absolute top-4 right-4 text-gray-400 hover:text-white bg-gray-800 p-2 rounded-full shadow-md transition-all duration-300'
          aria-label='Close Image Modal'
        >
          <LuX size={28} />
        </button>
        {selectedData.file_path ? (
          <>
            <img
              src={`https://image.tmdb.org/t/p/original${selectedData.file_path}`}
              alt='Selected Backdrop'
              className='max-w-[90vw] max-h-[80vh] rounded-lg shadow-2xl'
            />
            <a
              href={`https://image.tmdb.org/t/p/original${selectedData.file_path}`}
              download
              className='absolute top-4 right-16 text-gray-400 hover:text-white bg-gray-800 p-2 rounded-full shadow-md transition-all duration-300'
              aria-label='Download Image'
            >
              <LuDownload size={28} />
            </a>
          </>
        ) : (
          <iframe
            src={`https://www.youtube.com/embed/${selectedData.key}?autoplay=1`}
            title={selectedData.name}
            className='shadow-md rounded-lg min-w-[90vw] min-h-[80vh]'
            allow='autoplay; encrypted-media'
            allowFullScreen
          />
        )}
      </div>
    </div>
  )
}

export default GalleryModal
