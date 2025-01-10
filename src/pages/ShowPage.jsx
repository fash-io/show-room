import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import Loading from '../components/Loaders/Loading'
import Error from '../components/Error'
import { fetchData } from '../utils/tmdbfetch'
import Hero from '../components/show-page/Hero'
import ShowDetails from '../components/show-page/ShowDetails'
import ScrollCard from '../components/show-page/ScrollCard'
import TitleCards from '../components/TitleCards'
import ShowCollection from '../components/show-page/ShowCollection'
import randomizeArray from 'randomize-array'
import { options } from '../utils/api'
import axios from 'axios'
import Gallery from '../components/show-page/Gallery'
import { calculateDaysToNextEpisode } from '../utils/calculate-date-to-air'

const ContentPage = () => {
  const { id, type } = useParams()
  const [content, setContent] = useState(null)
  const [credits, setCredits] = useState({ cast: [], crew: [] })
  const [backdrops, setBackdrops] = useState([])
  const [posters, setPosters] = useState([])
  const [videos, setVIdeos] = useState([])
  const [error, setError] = useState(null)
  const [recommendations, setRecommendations] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchContentDetails = async () => {
      setLoading(true)
      try {
        fetchData({
          url: `https://api.themoviedb.org/3/${
            type === 'series' ? 'tv' : 'movie'
          }/${id}?language=en-US`,
          setData: setContent,
          single: true,
          setError: setError
        })

        fetchData({
          url: `https://api.themoviedb.org/3/${
            type === 'series' ? 'tv' : 'movie'
          }/${id}/credits`,
          setData: setCredits,
          single: true,
          setError: setError
        })
        let data = []
        for (let i = 1; i <= 3; i++) {
          let response = await axios.get(
            `https://api.themoviedb.org/3/${
              type === 'series' ? 'tv' : 'movie'
            }/${id}/recommendations?language=en-US&page=${i}`,
            options
          )
          data = data.concat(response.data.results)
        }
        setRecommendations(randomizeArray(data))

        const fetchImages = async () => {
          await fetchData({
            url: `https://api.themoviedb.org/3/${
              type === 'series' ? 'tv' : 'movie'
            }/${id}/images`,
            setData: setBackdrops,
            single: true,
            setError: setError
          })
          const data = await axios.get(
            `https://api.themoviedb.org/3/${
              type === 'series' ? 'tv' : 'movie'
            }/${id}/images`,
            options
          )
          const backdrops_ = data.data.backdrops
          const posters_ = data.data.posters

          setBackdrops(backdrops_)
          setPosters(posters_)
        }

        fetchImages()
        fetchData({
          url: `https://api.themoviedb.org/3/${
            type === 'series' ? 'tv' : 'movie'
          }/${id}/videos?language=en-US`,
          setData: setVIdeos,
          setError: setError
        })
      } catch (err) {
        console.error('Failed to fetch content details or backdrops:', err)
        setError('Failed to load content details.')
      } finally {
        setLoading(false)
      }
    }

    fetchContentDetails()
  }, [id, type])

  if (loading) {
    return <Loading />
  }
  if (error || !content) {
    return <Error error={error} />
  }

  const directors =
    type === 'series'
      ? content.created_by
      : credits.crew.filter(member => member.job === 'Director')

  console.log(content)

  return (
    <>
      {loading && <Loading transparent={true} />}
      <div className='text-white min-h-screen'>
        <Hero content={content} />
        <ShowDetails content={content} />
        {backdrops.length > 0 && (
          <Gallery backdrops={backdrops} videos={videos} posters={posters} />
        )}
        {type === 'series' && content?.next_episode_to_air && (
          <div className='p-6 sm:p-6 md:p-10 lg:p-20'>
            <h2 className='text-2xl sm:text-3xl font-semibold mb-4'>
              Next Episode
            </h2>
            <p>
              <span className='font-semibold'>Title:</span>{' '}
              {content?.next_episode_to_air.name ||
                'Episode ' + content?.next_episode_to_air.episode_number}
            </p>
            <p>
              <span className='font-semibold'>Air Date:</span>{' '}
              {content?.next_episode_to_air.air_date +
                ' (' +
                calculateDaysToNextEpisode(
                  content?.next_episode_to_air.air_date
                )}{' '}
              {calculateDaysToNextEpisode(
                content?.next_episode_to_air.air_date
              ) === 1
                ? 'day'
                : 'days'}{' '}
              left{')'}
            </p>
            <p>
              <span className='font-semibold'>Season:</span>{' '}
              {content?.next_episode_to_air.season_number}
            </p>
            <p>
              <span className='font-semibold'>Episode:</span>{' '}
              {content?.next_episode_to_air.episode_number}
            </p>
          </div>
        )}

        <div className='p-4 sm:p-6 md:p-10 lg:p-20 space-y-4  lg:pb-0'>
          {credits?.cast?.length > 0 && (
            <>
              <h2 className='text-2xl sm:text-3xl font-semibold mb-4'>Cast</h2>
              <div
                className={`flex overflow-x-scroll space-x-4 sm:space-x-7 pb-4 div`}
              >
                {credits.cast.map((actor, i) => (
                  <ScrollCard person={actor} key={i} />
                ))}
              </div>
            </>
          )}

          {directors?.length > 0 && (
            <>
              <h2 className='text-2xl sm:text-3xl font-semibold mb-4'>
                Director(s)
              </h2>
              <div className='flex overflow-x-scroll space-x-4 pb-4 div'>
                {directors.map((director, i) => (
                  <ScrollCard person={director} key={i} />
                ))}
              </div>
            </>
          )}
        </div>

        {content?.belongs_to_collection && (
          <ShowCollection
            content={content}
            setError={setError}
            label={'Collection'}
          />
        )}
        {content?.seasons?.length > 1 && (
          <ShowCollection
            content={content}
            setError={setError}
            label={'Seasons'}
          />
        )}
        {recommendations.length > 0 && (
          <div className='p-4 sm:p-6 md:p-10'>
            <TitleCards
              type={type}
              data_={recommendations}
              title='Recommendations'
              className={'text-2xl sm:text-3xl font-semibold mb-4'}
            />
          </div>
        )}
      </div>
    </>
  )
}

export default ContentPage
