/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import { fetchData } from '../utils/tmdbfetch'
import { getLogos } from '../utils/get-font'
import SeasonScroller from '../components/season-page/SeasonScroller'
import ScrollCard from '../components/show-page/ScrollCard'
import SeasonTable from '../components/season-page/SeasonTable'
import { all } from 'axios'

const SeasonPage = ({ setError }) => {
  const { id } = useParams()
  const [searchParams, setSearchParams] = useSearchParams()
  const [showData, setShowData] = useState({})
  const [seasonDetails, setSeasonDetails] = useState({})
  const [allSeasons, setAllSeasons] = useState([])

  const [episodes, setEpisodes] = useState([])
  const [crew, setCrew] = useState([])
  const [logo, setLogo] = useState('')
  const [loading, setLoading] = useState(false)
  const selectedSeason = searchParams.get('season')
  const [crewType, setCrewType] = useState('cast')

  useEffect(() => {
    const fetchShowData = async () => {
      const dataProps = {
        url: `https://api.themoviedb.org/3/tv/${id}?language=en-US`,
        setData: setShowData,
        single: true,
        setError
      }
      fetchData(dataProps)
      getLogos(`https://api.themoviedb.org/3/tv/${id}/images`, setLogo)
    }
    fetchShowData()
  }, [id, setError])

  useEffect(() => {
    if (selectedSeason) {
      const fetchSeasonDetails = async () => {
        const dataProps = {
          url: `https://api.themoviedb.org/3/tv/${id}/season/${selectedSeason}?language=en-US&append_to_response=credits`,
          setData: setSeasonDetails,
          single: true,
          setError,
          setLoading: setLoading
        }
        fetchData(dataProps)
      }
      fetchSeasonDetails()
    }
  }, [id, selectedSeason, setError])

  useEffect(() => {
    if (showData.seasons) {
      setAllSeasons(showData.seasons)
    }
    if (seasonDetails.episodes) {
      setEpisodes(seasonDetails.episodes)
    }
    if (seasonDetails.credits) {
      setCrew(seasonDetails.credits)
    }
  }, [showData, seasonDetails])

  const handleSeasonSelect = seasonNumber => {
    if (selectedSeason === seasonNumber.toString()) {
      setSearchParams({})
      window.scrollTo({ top: 0 })
    } else {
      setSearchParams({ season: seasonNumber })
      document
        .getElementById('season-details')
        .scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <div className='relative text-white'>
      <div className='relative flex flex-col justify-end h-[90vh] bg-cover bg-center mb-40'>
        <img
          src={`https://image.tmdb.org/t/p/original${showData.backdrop_path}`}
          className='w-full h-full top-0 left-0 absolute object-cover object-bottom -z-20 rounded-b-[190px]'
          alt=''
        />
        <div className='absolute inset-0 bg-opacity-60 bg-black -z-10 rounded-b-[190px]'></div>
        <div className='flex flex-col gap-5 translate-y-20 px-1 sm:px-8'>
          <div className='mx-auto max-w-4xl text-center sm:text-left'>
            {logo ? (
              <img
                src={`https://image.tmdb.org/t/p/w500${logo}`}
                alt={showData.title || showData.name}
                className='w-[110px] sm:max-w-[250px] md:max-w-[350px] md:min-w-[350px] mx-auto sm:ms-auto'
              />
            ) : (
              <h1 className='md:text-2xl'>{showData.title || showData.name}</h1>
            )}
            <p className='text-sm tracking-wider text-gray-400 mt-4'>
              {showData.overview}
            </p>
          </div>
          <SeasonScroller
            allSeasons={allSeasons}
            selectedSeason={selectedSeason}
            handleSeasonSelect={handleSeasonSelect}
          />
        </div>
      </div>

      {/* Season Details */}
      {selectedSeason && seasonDetails && (
        <SeasonTable
          episodes={episodes}
          selectedSeason={selectedSeason}
          id={id}
          loading={loading}
          handleSeasonSelect={handleSeasonSelect}
          allSeasons={allSeasons}
          seasonDetails={seasonDetails}
        />
      )}
      {crew.cast && (
        <div className='max-w-7xl px-6 mx-auto mt-5'>
          <div className='flex gap-5'>
            {['cast', 'crew'].map(type => (
              <h2
                key={type}
                className={`text-2xl sm:text-3xl font-semibold  inline-block cursor-pointer capitalize ${
                  crewType === type
                    ? 'order-1'
                    : 'scale-50 text-gray-400 order-2'
                } `}
                onClick={() => setCrewType(type)}
              >
                {type}
              </h2>
            ))}
          </div>
          {crew[crewType]?.length > 0 && (
            <div
              className={`flex overflow-x-scroll space-x-4 sm:space-x-7 py-4 div`}
            >
              {crew[crewType]?.map((actor, i) => (
                <ScrollCard person={actor} key={i} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default SeasonPage
