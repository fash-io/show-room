import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import ShowCard from '../components/ShowCard'
import Error from '../components/Error'
import Loading from '../components/Loaders/Loading'
import { fetchData } from '../utils/tmdbfetch'

const CollectionPage = () => {
  const [collection, setCollection] = useState(null)
  const [error, setError] = useState(null)
  const { id } = useParams()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const dataProps = {
      url: `https://api.themoviedb.org/3/collection/${id}?language=en-US`,
      setData: setCollection,
      single: true,
      setLoading: setLoading,
      setError: setError
    }
    fetchData(dataProps)
  }, [id])

  if (loading) {
    return <Loading />
  }

  if (error) {
    return (
      <>
        <Error error={error} />
      </>
    )
  }

  return (
    <>
      <div className='min-h-screen bg-black text-white'>
        {collection && (
          <>
            {/* Backdrop Section */}
            <div className='relative w-full h-[80vh]'>
              <img
                src={`https://image.tmdb.org/t/p/original${
                  collection.backdrop_path || collection.poster_path
                }`}
                alt={collection.title || collection.name}
                className='object-cover w-full h-full'
              />
              <div className='absolute inset-0 bg-gradient-to-b from-black/60 to-black' />
              <div className='absolute inset-0 bg-black/30 backdrop-blur-sm' />
              <div className='absolute bottom-16 left-10'>
                <h1 className='text-3xl sm:text-5xl font-extrabold drop-shadow-lg'>
                  {collection.title || collection.name}
                </h1>
                <p className='text-sm sm:text-base text-gray-300 mt-3'>
                  {collection.overview || 'No description available.'}
                </p>
              </div>
            </div>

            {/* Poster and Overview */}
            <div className='p-6 md:p-12 lg:p-20 grid grid-cols-1 md:grid-cols-3 gap-10'>
              {/* Poster */}
              <div className='flex justify-center md:justify-start'>
                <img
                  src={`https://image.tmdb.org/t/p/original${collection.poster_path}`}
                  alt={`${collection.title || collection.name} Poster`}
                  className='w-72 sm:w-96 rounded-lg shadow-xl transition-transform transform hover:scale-105'
                />
              </div>
              {/* Overview */}
              <div className='col-span-2'>
                <h2 className='text-2xl sm:text-3xl font-bold mb-4'>
                  Overview
                </h2>
                <p className='text-base sm:text-lg text-gray-300 leading-relaxed'>
                  {collection.overview || 'No overview available.'}
                </p>
                {/* Metadata */}
                <div className='mt-6 text-sm text-gray-400 space-y-2'>
                  <p>
                    <span className='font-bold text-gray-200'>
                      Number of Movies:
                    </span>{' '}
                    {collection.parts?.length || 'Unknown'}
                  </p>
                  <p>
                    <span className='font-bold text-gray-200'>
                      Collection ID:
                    </span>{' '}
                    {id}
                  </p>
                </div>
              </div>
            </div>

            {/* Movies Section */}
            <div className='container mx-auto p-6 md:p-12'>
              <h2 className='text-3xl sm:text-4xl font-bold mb-6'>
                Movies in Collection
              </h2>
              <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8'>
                {collection?.parts?.map(movie => (
                  <ShowCard
                    key={movie.id}
                    show={movie}
                    type_={movie.media_type}
                    type={1}
                  />
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </>
  )
}

export default CollectionPage
