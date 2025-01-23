import { useState, useEffect, useCallback } from 'react'
import {
  useParams,
  useNavigate,
  useSearchParams,
  useLocation
} from 'react-router-dom'
import ShowCard from '../components/ShowCard'
import Loader_ from '../components/Loaders/Loader_'
import FilterOptions from '../components/shows-page/FilterOptions'
import { BiErrorCircle } from 'react-icons/bi'
import { RxReload } from 'react-icons/rx'
import {
  featured,
  FeaturedMoviesTitles,
  FeaturedSeriesTitles
} from '../constants'
import TitleCards from '../components/TitleCards'
import axios from 'axios'
import { options } from '../utils/api'

const TVShowsPage = () => {
  const { type } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()

  const [shows, setShows] = useState([])
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [filters, setFilters] = useState({
    include_adult: searchParams.get('include_adult') || false,
    primary_release_year: searchParams.get('primary_release_year') || '',
    sort_by: searchParams.get('sort_by') || 'popularity.desc',
    with_people: searchParams.get('with_people') || '',
    with_watch_providers: searchParams.get('with_watch_providers') || '',
    watch_region: searchParams.get('watch_region') || '',
    with_keywords: searchParams.get('with_keywords') || '',
    with_genres: searchParams.get('with_genres') || '',
    with_original_language: searchParams.get('with_original_language') || '',
    with_origin_country: searchParams.get('with_origin_country') || '',
    'with_runtime.gte': searchParams.get('with_runtime.gte') || '',
    'with_runtime.lte': searchParams.get('with_runtime.lte') || ''
  })
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [error, setError] = useState(null)
  const isExploring = !searchParams.toString()

  const showType = type === 'movies' ? 'movie' : type === 'series' ? 'tv' : null
  const featured_ =
    type === 'movies'
      ? FeaturedMoviesTitles
      : type === 'series'
      ? FeaturedSeriesTitles
      : featured

  const sanitizeFilters = filters => {
    const sanitized = {}
    for (const key in filters) {
      if (
        filters[key] !== null &&
        filters[key] !== '' &&
        filters[key] !== undefined
      ) {
        sanitized[key] = filters[key]
      }
    }
    return sanitized
  }
  const fetchShows = useCallback(async () => {
    try {
      const queryParams = new URLSearchParams(
        sanitizeFilters(filters)
      ).toString()
      const url = showType
        ? `https://api.themoviedb.org/3/discover/${showType}?${queryParams}&page=${page}`
        : `https://api.themoviedb.org/3/trending/all/week?language=en-US&page=${page}`
      console.log(url)
      const response = await axios.get(url, options)
      setShows(prev =>
        page === 1 ? response.data.results : [...prev, ...response.data.results]
      )
      setTotalPages(response.data.total_pages)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
      setLoadingMore(false)
    }
  }, [page, showType, filters])

  useEffect(() => {
    setLoading(true)
    setPage(1)
    setTotalPages(10)
    window.scrollTo({ top: 0 })
  }, [location.search, filters])

  useEffect(() => {
    if (!location.search) {
      setFilters({})
    }
  }, [location])

  useEffect(() => {
    fetchShows()
  }, [fetchShows])

  const handleTypeChange = newType => {
    navigate(`/shows/${newType}`)
  }

  const handleShowMore = feature => {
    let newFilters = { ...filters }

    feature.forEach(f => {
      const filterKey = f.label.replace('&', '')
      newFilters[filterKey] = f.key
    })

    const sanitizedFilters = sanitizeFilters(newFilters)
    setFilters(sanitizedFilters)
    setSearchParams(sanitizedFilters)
  }

  const handleLoadMore = () => {
    if (page < totalPages) {
      setPage(prev => prev + 1)
      setLoadingMore(true)
    }
  }
  return (
    <div className='min-h-screen text-white'>
      <div className='mx-auto pt-10 px-3 lg:px-16'>
        {isExploring ? (
          <div>
            <h3 className='text-center text-3xl mt-14 text-pink-600'>
              {type.toUpperCase()}
            </h3>

            {featured_.map((feature, i) => (
              <TitleCards
                key={i}
                title={feature.title}
                category={feature.category}
                type={feature.type}
                feature={feature.feature}
                type_={showType}
                sort={feature.sort}
                url_={feature.url}
                onShowMore={() => handleShowMore(feature.feature)}
              />
            ))}
          </div>
        ) : (
          <div className='grid grid-cols-12 gap-6 '>
            {/* Sidebar Filters */}
            <div className='md:col-span-3 absolute md:relative min-h-[90vh] z-50'>
              <FilterOptions
                filters={filters}
                type={type}
                setFilters={newFilters => {
                  setFilters(newFilters)
                  setSearchParams(newFilters)
                }}
                handleTypeChange={handleTypeChange}
              />
            </div>

            {/* Shows Grid */}
            <div className='col-span-12 md:col-span-9 md:pt-10'>
              <h2 className='text-center text-3xl sm:text-4xl font-bold text-slate-300 mb-7'>
                {type === 'movies'
                  ? 'Movies'
                  : type === 'series'
                  ? 'Series'
                  : 'All Shows'}
              </h2>
              {error ? (
                <div className='text-center flex flex-col items-center text-red-500'>
                  <span className='flex gap-2 items-center'>
                    <BiErrorCircle />
                    {error}
                  </span>
                  <button
                    className='p-2 rounded-3xl my-1 bg-gray-800 text-white hover:bg-gray-700 '
                    onClick={fetchShows}
                  >
                    {loading ? (
                      <Loader_ className={'scale-50 '} />
                    ) : (
                      <RxReload size={20} />
                    )}
                  </button>
                </div>
              ) : loading ? (
                <Loader_ />
              ) : (
                <div className='grid grid-cols-3 md:p-3 sm:grid-cols-5 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-5 gap-3 md:gap-5'>
                  {shows.map(show => (
                    <ShowCard
                      key={show.id}
                      type_={showType}
                      show={show}
                      type={1}
                    />
                  ))}
                </div>
              )}
              {!error && page < totalPages && (
                <button
                  className={`text-center text-sm w-full h-10 rounded-full bg-blue-800/50 px-20 hover:bg-blue-900 duration-200 mt-10 disabled:bg-blue-800/50 disabled:grayscale`}
                  onClick={handleLoadMore}
                  disabled={loadingMore}
                >
                  {loadingMore ? (
                    <Loader_ className={'scale-90'} />
                  ) : (
                    'Load more'
                  )}
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default TVShowsPage
