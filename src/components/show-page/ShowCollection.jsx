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

  console.log(content)

  return (
    <div className='p-4 sm:p-6 md:p-10 lg:p-20 max-w-full group'>
      <h2 className='text-2xl sm:text-3xl font-semibold mb-6 text-white'>
        {label}
      </h2>

      <div className='flex items-center gap-10'>
        <Link
          to={
            label === 'Collection'
              ? `/collection/${content.belongs_to_collection.id}`
              : `/show/${content.id}/season`
          }
          className='flex-shrink-0 w-[9rem] sm:w-44 group overflow-hidden rounded max-sm:hidden'
        >
          <img
            src={
              content.belongs_to_collection
                ? `https://image.tmdb.org/t/p/w300${
                    content.belongs_to_collection.poster_path ||
                    content.poster_path
                  }`
                : content.poster_path
                ? `https://image.tmdb.org/t/p/w300${content.poster_path}`
                : 'https://imageplaceholder.net/180x265/131313?text=No+Image'
            }
            alt={`${label} Poster`}
            className='rounded object-cover group-hover:scale-105 duration-500 bg-black mr-10'
          />
        </Link>

        <div
          className='flex flex-nowrap 
        overflow-x-scroll space-x-4 div'
        >
          <Link
            to={
              label === 'Collection'
                ? `/collection/${content.belongs_to_collection.id}`
                : `/show/${content.id}/season`
            }
            className='flex-shrink-0 w-[9rem] sm:w-44 group overflow-hidden rounded max-sm:block hidden'
          >
            <img
              src={
                content.belongs_to_collection
                  ? `https://image.tmdb.org/t/p/w300${
                      content.belongs_to_collection.poster_path ||
                      content.poster_path
                    }`
                  : content.poster_path
                  ? `https://image.tmdb.org/t/p/w300${content.poster_path}`
                  : 'https://imageplaceholder.net/180x265/131313?text=No+Image'
              }
              alt={`${label} Poster`}
              className='rounded object-cover group-hover:scale-105 duration-500 bg-black mr-10'
            />
            {content.belongs_to_collection?.name || content.name}
          </Link>
          {dataToUse?.map((item, i) => (
            <Link
              key={i}
              to={
                label === 'Collection'
                  ? `/movie/${item.id}`
                  : `/show/${content.id}/season?season=${item.season_number}`
              }
              className='flex-shrink-0 max-w-[150px]'
            >
              <div className='overflow-hidden'>
                <img
                  src={
                    item.poster_path
                      ? `https://image.tmdb.org/t/p/w300${item.poster_path}`
                      : 'https://via.placeholder.com/150x225?text=No+Image'
                  }
                  alt={item.title || item.name}
                  className='object-cover hover:scale-110 duration-200 h-[225px] rounded-lg'
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
