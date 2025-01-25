import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Error from '../components/Error'
import Loading from '../components/Loaders/Loading'
import { fetchData } from '../utils/tmdbfetch'
import SeasonScroller from '../components/season-page/SeasonScroller'

const CollectionPage = () => {
  const [collection, setCollection] = useState(null)
  const navigator = useNavigate()
  const [error, setError] = useState(null)
  const { id } = useParams()
  const [loading, setLoading] = useState(true)

  const handleSeasonSelect = id_ => {
    navigator(`/movie/${id_}`)
  }

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
      <div className='relative flex flex-col justify-end h-[90vh] bg-cover bg-center mb-40'>
        <img
          src={`https://image.tmdb.org/t/p/original${collection.backdrop_path}`}
          className='w-full h-full top-0 left-0 absolute object-cover object-bottom -z-20 rounded-b-[190px]'
          alt=''
        />
        <div className='flex flex-col gap-5 translate-y-20 px-1 sm:px-8'>
          <div className='mx-auto max-w-4xl text-center sm:text-left'>
            <h1 className='md:text-2xl'>{collection.name}</h1>
            <p className='text-sm tracking-wider text-gray-400 mt-4'>
              {collection.overview}
            </p>
          </div>
          <SeasonScroller
            allSeasons={collection.parts}
            handleSeasonSelect={handleSeasonSelect}
          />
        </div>
      </div>
    </>
  )
}

export default CollectionPage
