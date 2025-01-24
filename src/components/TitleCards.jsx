/* eslint-disable react/prop-types */
import { useContext, useEffect, useState, useCallback } from 'react'
import ShowCard from './ShowCard'
import { fetchDetails, options } from '../utils/api'
import UserContext from '../UserContext'
import axios from 'axios'
import { fetchTrailer } from '../utils/tmdbfetch'
import TopTen from './shows-page/TopTen'
import randomizeArray from 'randomize-array'
import { debounce } from 'lodash'

const TitleCards = ({
  userWatchList,
  data_,
  feature_,
  type_,
  onShowMore,
  title_
}) => {
  const { userData } = useContext(UserContext)
  const [watchListData, setWatchListData] = useState([])
  const [error, setError] = useState(null)
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const [activeTrailer, setActiveTrailer] = useState({ id: null, url: null })

  const {
    feature = '',
    type = '',
    category = '',
    title = '',
    sort = '',
    url = ''
  } = feature_ || {}

  useEffect(() => {
    const fetchApiData = async () => {
      if (!url && !feature && !category) return
      setLoading(true)
      try {
        const maxPages = 3
        const urls = Array.from({ length: maxPages }, (_, i) =>
          url
            ? `${url}&page=${i + 1}`
            : feature
            ? `https://api.themoviedb.org/3/discover/${
                type_ || 'movie'
              }?language=en-US&page=${i + 1}&sort_by=${
                sort || 'popularity.desc'
              }&vote_count.gte=100${feature
                .map(feat => `&${feat.label}=${feat.key}`)
                .join('')}`
            : `https://api.themoviedb.org/3/${type}/${category}?language=en-US&page=${
                i + 1
              }`
        )
        const responses = await Promise.all(
          urls.map(url_ => axios.get(url_, options))
        )
        const allData = responses.flatMap(response => response.data.results)
        setData(allData)
      } catch (err) {
        setError(err.message || 'Failed to fetch data.')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    const fetchWatchListData = async () => {
      if (!userData?.watchList?.length) return
      try {
        const detailedData = await Promise.all(
          userData.watchList.map(item => fetchDetails(item.id, item.type))
        )
        setWatchListData(detailedData)
      } catch (err) {
        setError('Failed to fetch watchlist data.')
        console.error(err)
      }
    }

    if (userWatchList) {
      fetchWatchListData()
    } else if (data_) {
      setData(randomizeArray(data_))
    } else {
      fetchApiData()
    }

    return () => {
      setError(null)
      setWatchListData([])
    }
  }, [
    category,
    type,
    userWatchList,
    userData,
    data_,
    type_,
    feature,
    sort,
    url
  ])

  const handleHover = async show => {
    if (activeTrailer.id === show.id) return

    try {
      const trailer = await fetchTrailer(type || type_ || show.type, show.id)
      setActiveTrailer({ id: show.id, url: trailer?.key || 'no' })
    } catch (error) {
      console.error('Error fetching trailer:', error)
      setActiveTrailer({ id: show.id, url: 'no' })
    }
  }

  const debouncedHandleHover = useCallback(
    debounce(show => handleHover(show), 2000),
    [activeTrailer.id]
  )

  if (loading)
    return (
      <>
        <h2 className='mb-1'>{title || 'Popular'}</h2>
        <div className='bg-[rgba(20,20,20,0.9)] h-[10vh] my-5 animate-pulse' />
      </>
    )

  if (error)
    return (
      <div className='h-[10vh] text-center text-red-500'>
        {error || 'Something went wrong. Please try again later.'}
      </div>
    )

  const dataToDisplay = userWatchList ? watchListData : data
  console.log(dataToDisplay)

  return dataToDisplay?.length > 0 ? (
    <div className='mt-3 sm:mt-7 md:mt-8 sm:mb-5 md:mb-8'>
      <div className='flex justify-between'>
        <h2 className='mb-1'>{title || title_ || 'Popular'}</h2>
        {onShowMore && feature && (
          <button className='cta flex items-center' onClick={onShowMore}>
            <span>Show all</span>
            <svg width='15px' height='10px' viewBox='0 0 13 10'>
              <path d='M1,5 L11,5'></path>
              <polyline points='8 1 12 5 8 9'></polyline>
            </svg>
          </button>
        )}
      </div>
      <div className='overflow-x-scroll py-3 space-x-3 whitespace-nowrap div inset-1'>
        {dataToDisplay.length > 0 ? (
          title.startsWith('Top 10') || title.startsWith('Netflix') ? (
            <TopTen data={dataToDisplay} type_={type_ || type} />
          ) : (
            dataToDisplay.map((card, i) => (
              <ShowCard
                key={i}
                i={i}
                type_={type_ || type || card.type}
                show={card}
                type={2}
                isPlaying={activeTrailer.id === card.id}
                trailerUrl={activeTrailer.url}
                onHover={() => debouncedHandleHover(card)}
                onHoverEnd={() => setActiveTrailer({ id: null, url: null })}
              />
            ))
          )
        ) : null}
      </div>
    </div>
  ) : (
    ''
  )
}

export default TitleCards
