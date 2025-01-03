import { useContext, useEffect, useState } from 'react'
import Loading from './Loading'
import Error from './Error'
import ShowCard from './ShowCard'
import { options, fetchDetails } from '../utils/api'
import UserContext from '../UserContext'
import randomizeArray from 'randomize-array'

const TitleCards = ({ title, category, type, userWatchlist }) => {
  const { userData } = useContext(UserContext)
  const [watchlistData, setWatchlistData] = useState([])
  const [error, setError] = useState(null)
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchApiData = async () => {
      setLoading(true)
      try {
        let data = []
        for (let i = 1; i <= 3; i++) {
          let response = await fetch(
            `https://api.themoviedb.org/3/${type}/${category}?language=en-US&page=${i}`,
            options
          )
          let jsonData = await response.json()
          data = data.concat(jsonData.results)
        }

        setData(randomizeArray(data))
      } catch (err) {
        setError('Failed to load API data. Please try again later.')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    const fetchWatchListData = async () => {
      const watchlist = userData?.watchList || []
      const detailedWatchlistData = await Promise.all(
        watchlist.map(async item => fetchDetails(item.id, item.type))
      )
      setWatchlistData(detailedWatchlistData)
    }

    if (userWatchlist) {
      fetchWatchListData()
    } else {
      fetchApiData()
    }

    return () => {
      setError(null)
      setWatchlistData([])
    }
  }, [category, type, userWatchlist, userData, setLoading])

  if (loading) return <div className='bg-black h-[10vh]' />
  if (error) return <Error message={error} isSmall={true} />

  const dataToDisplay = userWatchlist ? watchlistData : data

  return (
    <div className='mt-3 mb-3 sm:mt-7 md:mt-12 sm:mb-5 md:mb-8'>
      <h2 className='mb-3 text-lg font-semibold'>
        {title || 'Popular on Netflix'}
      </h2>
      <div className='overflow-x-scroll whitespace-nowrap div inset-0 gradient'>
        {dataToDisplay.length > 0 ? (
          dataToDisplay.map(card => (
            <ShowCard key={card.id} type_={type} show={card} type={2} />
          ))
        ) : (
          <p className='p-5 border border-white/20 rounded'>
            No items found in Watchlist.
          </p>
        )}
      </div>
    </div>
  )
}

export default TitleCards
