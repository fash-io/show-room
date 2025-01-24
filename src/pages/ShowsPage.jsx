import { useState, useEffect, useCallback, useRef } from 'react'
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
      const response = await axios.get(url, options)
      if (response.data?.results?.length < 1) {
        setShows([])
        return
      }
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

  const observerRef = useRef()

  useEffect(() => {
    if (loading || loadingMore || page >= totalPages) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setPage(prev => prev + 1)
          setLoadingMore(true)
        }
      },
      { rootMargin: '100px' }
    )

    if (observerRef.current) {
      observer.observe(observerRef.current)
    }

    return () => {
      if (observerRef.current) observer.unobserve(observerRef.current)
    }
  }, [loading, loadingMore, page, totalPages])

  const handleShowMore = feature => {
    let newFilters = { ...filters }

    feature.forEach(f => {
      const filterKey = f.label.replace('&', '')
      newFilters[filterKey] = f.key
    })

    newFilters.sort_by = filters.sort_by || 'popularity.desc'
    newFilters.include_adult =
      filters.include_adult !== undefined ? filters.include_adult : false

    const sanitizedFilters = sanitizeFilters(newFilters)
    setFilters(sanitizedFilters)
    setSearchParams(sanitizedFilters)
  }

  return (
    <div className='min-h-screen text-white'>
      <div className='mx-auto pt-10'>
        {isExploring ? (
          <div className='pl-10'>
            <h3 className='text-center text-3xl mt-14 text-pink-600'>
              {type.toUpperCase()}
            </h3>
            {featured_.map((feature, i) => (
              <TitleCards
                key={i}
                type_={showType}
                feature_={feature}
                onShowMore={() => handleShowMore(feature.feature)}
              />
            ))}
          </div>
        ) : (
          <div className='grid grid-cols-12 gap-6 px-3 lg:px-16'>
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

            <div className='col-span-12 md:col-span-9 md:pt-10'>
              <h2 className='text-center text-3xl sm:text-4xl font-bold text-slate-300 mb-7'>
                {showType.toUpperCase()}
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
                      <Loader_ className='scale-50' />
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
              <div ref={observerRef} />
              {loadingMore && <Loader_ className='mt-5' />}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default TVShowsPage
