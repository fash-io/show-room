/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { fetchData } from '../../utils/tmdbfetch'
import { BsFilm } from 'react-icons/bs'

const ShowCollection = ({ content, setError, label }) => {
  const [data, setData] = useState({})
  const { seasons } = content

  useEffect(() => {
    if (label === 'Collection') {
      const fetchCollection = async () => {
        const dataProps = {
          url: `https://api.themoviedb.org/3/collection/${content.belongs_to_collection.id}?language=en-US`,
          setData: setData,
          single: true,
          setError: setError
        }
        fetchData(dataProps)
      }
      fetchCollection()
    }
  }, [content, setError, label])

  const dataToUse = label === 'Collection' ? data.parts : seasons

  return (
    <div className='p-4 sm:p-6 md:p-10 lg:p-20 max-w-full group'>
      <h2 className='text-2xl sm:text-3xl font-semibold mb-6 text-white'>
        {label}
      </h2>

      <div className='flex items-center gap-10'>
        <Link
          to={
            label === 'Collection' &&
            `/collection/${content.belongs_to_collection.id}`
          }
          className='flex-shrink-0 w-[9rem] sm:w-44 group overflow-hidden rounded-lg max-sm:hidden'
        >
          <img
            src={
              content.belongs_to_collection
                ? `https://image.tmdb.org/t/p/w300${
                    content.belongs_to_collection.poster_path ||
                    content.poster_path
                  }`
                : label === 'Seasons'
                ? `https://image.tmdb.org/t/p/w300${content.poster_path}`
                : 'https://via.placeholder.com/150x225?text=No+Image'
            }
            alt={`${label} Poster`}
            className='rounded-lg object-cover group-hover:scale-105 duration-500 bg-black mr-10'
          />
          {label === 'Collection' && (
            <div className='absolute z-50 px-1 py-3'>
              <h3 className='text-xl sm:text-2xl font-semibold bg-gradient-to-r from-[#f12711] to-[#f5af19] bg-clip-text text-transparent'>
                {content.belongs_to_collection.name}
              </h3>
            </div>
          )}
        </Link>
        <BsFilm className='text-5xl text-gray-400 group-hover:text-[#ff7e5f] transition duration-300 max-sm:hidden' />

        <div className='flex flex-nowrap overflow-x-scroll inset-10 div space-x-4 '>
          {dataToUse?.map(item => (
            <Link
              key={item.id}
              to={label === 'Collection' && `/movie/${item.id}`}
              className={`flex-shrink-0 max-w-[150px] ${
                label === 'Seasons' && 'cursor-default'
              }`}
            >
              <div className='overflow-hidden'>
                <img
                  src={
                    item.poster_path
                      ? `https://image.tmdb.org/t/p/w300${item.poster_path}`
                      : 'https://via.placeholder.com/150x225?text=No+Image'
                  }
                  alt={item.title || item.name}
                  className=' object-cover hover:scale-110 duration-200 overflow-hidden h-[225px]'
                />
              </div>
              <p className='text-sm mt-2 text-gray-200'>
                {item.title || item.name}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

export default ShowCollection
