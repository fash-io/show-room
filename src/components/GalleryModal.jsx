/* eslint-disable react/prop-types */
import { useState } from 'react'
import { BiExpand, BiSquareRounded, BiX } from 'react-icons/bi'
import { FaRegWindowRestore } from 'react-icons/fa'
import { LuDownload, LuMinimize, LuX } from 'react-icons/lu'

const GalleryModal = ({ selectedData, closeModal }) => {
  const [size, setSize] = useState('default')

  if (selectedData.file_path) {
    return (
      <div
        className='fixed inset-0 z-[1000] bg-black/90 flex justify-center items-center w-screen h-screen'
        onClick={closeModal}
      >
        <div className='relative' onClick={e => e.stopPropagation()}>
          <img
            src={`https://image.tmdb.org/t/p/original${selectedData.file_path}`}
            alt='Selected Backdrop'
            className='max-w-[90vw] max-h-[80vh] rounded shadow-2xl'
          />
          <button
            onClick={closeModal}
            className='absolute top-4 right-4 text-gray-400 hover:text-white bg-gray-800 p-2 rounded-full shadow-md transition-all duration-300'
            aria-label='Close Image Modal'
          >
            <LuX size={28} />
          </button>
          <a
            href={`https://image.tmdb.org/t/p/original${selectedData.file_path}`}
            download
            className='absolute top-4 right-16 text-gray-400 hover:text-white bg-gray-800 p-2 rounded-full shadow-md transition-all duration-300'
            aria-label='Download Image'
          >
            <LuDownload size={28} />
          </a>
        </div>
      </div>
    )
  } else {
    return (
      <div
        className={`fixed z-50 ${
          size === 'mini'
            ? 'md:w-[29rem] md:h-72 bottom-14 md:bottom-3 right-3 rounded-xl overflow-hidden'
            : ' inset-0 z-[1000] bg-black/90 flex justify-center items-center w-screen h-screen'
        }`}
        onClick={closeModal}
      >
        <div
          className={` relative duration-100 group ${
            size === 'mini'
              ? 'w-full h-full'
              : size === 'default'
              ? 'h-[33%] w-[95%] sm:h-3/4 sm:w-4/5 bg-gray-900 pt-6 pb-1 px-0.5'
              : 'h-screen w-screen bg-gray-900 pt-6 pb-1 px-0.5'
          }`}
          onClick={e => e.stopPropagation()}
        >
          {size === 'mini' ? (
            <div className=' w-full absolute hover:bg-black/ duration-200 flex items-start justify-between p-3'>
              <div className='w-full h-[1000%] group-hover:bg-black/40 pointer-events-none z-10 left-0 absolute top-0 bottom-0'></div>
              <button
                className='py-1 px-2 z-30 hover:bg-white/20 duration-300'
                onClick={() => setSize('default')}
              >
                <BiExpand size={20} />
              </button>
              <button
                className='py-1 px-2 z-30 hover:bg-red-600 duration-300'
                onClick={closeModal}
              >
                <BiX size={20} />
              </button>
            </div>
          ) : (
            <div className='absolute top-0 right-0'>
              <button
                className='py-1 px-2 hover:bg-white/20 duration-300'
                onClick={() => setSize('mini')}
              >
                <LuMinimize size={13} />
              </button>
              <button
                className='py-1 px-2 hover:bg-white/20 duration-300'
                onClick={() =>
                  size === 'full' ? setSize('default') : setSize('full')
                }
              >
                {size === 'full' ? (
                  <FaRegWindowRestore size={13} />
                ) : (
                  <BiSquareRounded size={13} />
                )}
              </button>
              <button
                className='py-1 px-2 hover:bg-red-600 duration-300'
                onClick={closeModal}
              >
                <BiX />
              </button>
            </div>
          )}
          <iframe
            src={`https://www.youtube.com/embed/${
              selectedData.key ? selectedData.key : selectedData
            }?autoplay=1`}
            title={selectedData.name}
            className='w-full h-full'
            allow='autoplay; encrypted-media'
            allowFullScreen
          />
        </div>
      </div>
    )
  }
}

export default GalleryModal
