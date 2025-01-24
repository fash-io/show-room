/* eslint-disable react/prop-types */
import { BiLogoYoutube, BiZoomIn } from 'react-icons/bi'
import { LuX } from 'react-icons/lu'
const ShowGallery = ({ selectedType, data, onClose, handleClick }) => {
  return (
    <>
      <div
        className='fixed top-0 left-0 z-[999] bg-black/80 w-screen h-screen flex justify-center items-center overflow-hidden'
        onClick={onClose}
      >
        <div
          className='relative w-11/12 max-w-5xl bg-gray-900 rounded pb-6 pt-0 overflow-y-scroll max-h-[90vh]'
          onClick={e => e.stopPropagation()}
        >
          <div className='sticky top-0 z-10 bg-gray-900 px-10 py-5 pb-2 flex items-center justify-between'>
            <h2 className='text-white text-lg font-semibold'>Gallery</h2>
            <button
              onClick={onClose}
              className='bg-gray-800 text-white rounded-full p-2 hover:bg-gray-700'
            >
              <LuX />
            </button>
          </div>
          <div
            className={`grid p-2 sm:p-4 md:p-6 ${
              selectedType === 'poster'
                ? 'grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2'
                : 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2'
            }`}
          >
            {data.map((data, index) => (
              <div
                key={index}
                className='relative overflow-hidden rounded group'
              >
                <div className='w-full relative'>
                  <img
                    src={
                      selectedType === 'video'
                        ? `https://img.youtube.com/vi/${data.key}/hqdefault.jpg`
                        : `https://image.tmdb.org/t/p/w780${data.file_path}`
                    }
                    alt={`Backdrop ${index + 1}`}
                    className={`shadow-md cursor-pointer   duration-200  object-cover w-full ${
                      selectedType !== 'video' && 'hover:scale-110'
                    }`}
                    onClick={() => handleClick(data)}
                  />
                  <div className='absolute top-0 h-full w-full left-0 bg-black/50  flex justify-center items-center pointer-events-none opacity-0 group-hover:opacity-100 duration-200'>
                    {selectedType === 'video' ? (
                      <BiLogoYoutube size={40} />
                    ) : (
                      <BiZoomIn size={40} />
                    )}
                  </div>
                </div>
                {data.name && (
                  <div className='text-xs'>
                    {data.name}
                    {' ('}
                    {data.type}
                    {')'}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}

export default ShowGallery
