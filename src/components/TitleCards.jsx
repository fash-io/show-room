/* eslint-disable react/prop-types */
import { useContext, useEffect, useState } from 'react'
import Error from './Error'
import ShowCard from './ShowCard'
import { options, fetchDetails } from '../utils/api'
import UserContext from '../UserContext'
import randomizeArray from 'randomize-array'
import axios from 'axios'

const TitleCards = ({
  title,
  category,
  type,
  userWatchlist,
  data_,
  className
}) => {
  const { userData } = useContext(UserContext)
  const [watchlistData, setWatchlistData] = useState([])
  const [error, setError] = useState(null)
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  useEffect(() => {
    const fetchApiData = async () => {
      setLoading(true)
      try {
        let data = []
        for (let i = 1; i <= 3; i++) {
          let response = await axios.get(
            `https://api.themoviedb.org/3/${type}/${category}?language=en-US&page=${i}`,
            options
          )
          data = data.concat(response.data.results)
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

    if (data_) {
      setData(data_)
    } else {
      if (userWatchlist) {
        fetchWatchListData()
      } else {
        fetchApiData()
      }
    }

    return () => {
      setError(null)
      setWatchlistData([])
    }
  }, [category, type, userWatchlist, userData, setLoading, data_])

  if (loading) return <div className='bg-black h-[10vh]' />
  if (error) return <Error message={error} isSmall={true} />

  const dataToDisplay = userWatchlist ? watchlistData : data

  return (
    <div
      className='mt-3 sm:mt-7 md:mt-8 sm:mb-5 md:mb-8'
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={`absolute h-[30%] md:h-[35%] w-20 bg right-0 z-10 bg-gradient-to-r from-transparent  hover:opacity-0 transition-all duration-200 to-black ${
          isHovered && 'pointer-events-none opacity-0'
        }`}
      ></div>
      <h2 className={`mb-1 ${className}`}>{title || 'Popular'}</h2>
      <div className='overflow-x-scroll whitespace-nowrap div inset-1'>
        {dataToDisplay.length > 0 ? (
          dataToDisplay.map((card, i) => (
            <ShowCard key={i} type_={type} show={card} type={2} />
          ))
        ) : (
          <p className='p-5 border border-white/20 rounded'>
            No items found in WatchList.
          </p>
        )}
      </div>
    </div>
  )
}

export default TitleCards
