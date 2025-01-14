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
      <div className='min-h-screen text-white'>
        {collection && (
          <>
            <div className='relative w-full h-96 sm:h-[600px] max-h-[75vh]'>
              <img
                src={`https://image.tmdb.org/t/p/original${
                  collection.backdrop_path || collection.poster_path
                }`}
                alt={collection.title || collection.name}
                className='object-cover w-full h-full object-top'
              />
              <div className='absolute inset-0 bg-gradient-to-t from-black to-transparent' />
              <div className='absolute bottom-10 left-5 sm:left-10 p-4 sm:p-8'>
                <h1 className='text-2xl sm:text-4xl md:text-5xl font-bold mb-2'>
                  {collection.title || collection.name}
                </h1>
              </div>
            </div>
            <div className='p-4 sm:p-6 md:p-10 lg:p-20 grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-10'>
              <div className='flex justify-center md:justify-start'>
                <img
                  src={`https://image.tmdb.org/t/p/original${collection.poster_path}`}
                  alt={`${collection.title || collection.name} Poster`}
                  className='w-64 sm:w-80 rounded-lg shadow-lg'
                />
              </div>
              <div className='col-span-2 space-y-4'>
                <h2 className='text-2xl sm:text-3xl font-bold'>Overview</h2>
                <p className='text-sm sm:text-lg p-9'>{collection.overview}</p>
              </div>
            </div>
          </>
        )}

        <div className='container mx-auto p-8'>
          <h2 className='text-4xl font-semibold mb-8'>Movies in Collection</h2>
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
      </div>
    </>
  )
}

export default CollectionPage
