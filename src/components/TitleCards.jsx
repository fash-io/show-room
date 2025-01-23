/* eslint-disable react/prop-types */
import { useContext, useEffect, useState } from 'react'
import ShowCard from './ShowCard'
import { options, fetchDetails } from '../utils/api'
import UserContext from '../UserContext'
import randomizeArray from 'randomize-array'
import axios from 'axios'
import { fetchTrailer } from '../utils/tmdbfetch'
import TopTen from './shows-page/TopTen'

const TitleCards = ({
  title,
  category,
  type,
  userWatchList,
  data_,
  feature,
  type_,
  onShowMore,
  disableHover,
  sort,
  url_
}) => {
  const { userData } = useContext(UserContext)
  const [watchListData, setWatchListData] = useState([])
  const [error, setError] = useState(null)
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const [activeTrailer, setActiveTrailer] = useState({ id: null, url: null })

  useEffect(() => {
    const fetchApiData = async () => {
      setLoading(true)
      try {
        let data = []
        const maxPages = 3
        let url

        for (let i = 1; i <= maxPages; i++) {
          url = url_
            ? `${url_}&page=${i}`
            : feature
            ? `https://api.themoviedb.org/3/discover/${
                type_ || 'movie'
              }?language=en-US&page=${i}&sort_by=${
                sort ? sort : 'popularity.desc'
              }&vote_count.gte=100${feature
                .map(feat => `&${feat.label}=${feat.key}`)
                .join('')}`
            : `https://api.themoviedb.org/3/${type}/${category}?language=en-US&page=${i}`

          const response = await axios.get(url, options)
          data = data.concat(response.data.results)
        }

        setData(data)
      } catch (err) {
        setError(err)
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    const fetchWatchListData = async () => {
      const watchList = userData?.watchList || []
      const detailedWatchListData = await Promise.all(
        watchList.map(async item => fetchDetails(item.id, item.type))
      )
      setWatchListData(detailedWatchListData)
    }

    if (userWatchList) {
      fetchWatchListData()
    } else if (data_) {
      setData(randomizeArray(data_))
    } else fetchApiData()

    return () => {
      setError(null)
      setWatchListData([])
    }
  }, [
    category,
    type,
    userWatchList,
    userData,
    setLoading,
    data_,
    type_,
    feature,
    sort,
    url_
  ])

  const handleHover = async show => {
    if (activeTrailer.id === show.id) {
      setActiveTrailer({ id: null, url: null })
    } else {
      const trailer = await fetchTrailer(type || type_, show.id)
      !trailer && setActiveTrailer({ id: show.id, url: 'no' })
      setActiveTrailer({ id: show.id, url: trailer.key })
    }
  }
  if (loading)
    return (
      <>
        <h2 className={`mb-1`}>{title || 'Popular'}</h2>
        <div className='bg-[rgba(20,20,20,0.9)] h-[10vh] my-5 animate-pulse' />
      </>
    )
  if (error) return <div className='h-[10vh] text-center'>{error.message}</div>

  const dataToDisplay = userWatchList ? watchListData : data

  return (
    <div className='mt-3 sm:mt-7 md:mt-8 sm:mb-5 md:mb-8'>
      <div className='flex justify-between'>
        <h2 className={`mb-1`}>{title || 'Popular'}</h2>
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
          title.startsWith('Top 10') || title === 'Netflix Top 10' ? (
            <TopTen data={dataToDisplay} type_={type_ || type} />
          ) : (
            dataToDisplay.map((card, i) => (
              <ShowCard
                key={i}
                i={i}
                type_={type_ || type}
                show={card}
                type={2}
                isPlaying={activeTrailer.id === card.id}
                trailerUrl={activeTrailer.url}
                onHover={() => handleHover(card)}
                onHoverEnd={() => setActiveTrailer({ id: null, url: null })}
                disableHover={disableHover}
              />
            ))
          )
        ) : (
          <></>
        )}
      </div>
    </div>
  )
}

export default TitleCards
