/* eslint-disable react/prop-types */
import { useState } from 'react'
import SortType from './SortType'
import ServiceProvider from './ServiceProvider'
import Filters from './Filters'
import AdvancedFilters from './AdvancedFilters'
import { BiTrash } from 'react-icons/bi'
import { RiArrowGoBackFill } from 'react-icons/ri'
import { FiFilter } from 'react-icons/fi'

const FilterOptions = ({ setFilters, type, filters }) => {
  const [selectedProviders, setSelectedProviders] = useState(
    (filters?.with_watch_providers?.length > 0 &&
      filters?.with_watch_providers?.split(',').map(Number)) ||
      []
  )
  const [SelectedKeywords, setSelectedKeywords] = useState(
    (filters?.with_keywords?.length > 0 &&
      filters?.with_keywords?.split(',').map(Number)) ||
      []
  )
  const [watchRegion, setWatchRegion] = useState(filters?.watch_region || '')
  const [selectedPeople, setSelectedPeople] = useState(
    (filters?.with_people?.length > 0 &&
      filters?.with_people?.split(',').map(Number)) ||
      []
  )
  const [includeAdult, setIncludeAdult] = useState(
    filters?.include_adult || false
  )
  const [sortOption, setSortOption] = useState(
    filters?.sort_by || 'popularity.desc'
  )
  const [genres, setGenres] = useState(
    (filters?.with_genres?.length > 0 &&
      filters?.with_genres?.split(',').map(Number)) ||
      []
  )
  const [runtime, setRuntime] = useState({
    gte: filters['with_runtime.gte'] || '',
    lte: filters['with_runtime.lte'] || ''
  })
  const [originalLanguage, setOriginalLanguage] = useState(
    filters?.with_original_language || ''
  )
  const [originCountry, setOriginCountry] = useState(
    filters?.with_origin_country || ''
  )
  const [date, setDate] = useState({ gte: null, lte: null })
  const [voteAverage, setVoteAverage] = useState({ gte: '', lte: '' })
  const [voteCount, SetVoteCount] = useState('')
  const [openedModal, setOpenedModal] = useState('')
  const [primaryDate, setPrimaryDate] = useState('')

  const type_ = type === 'movies' ? 'movie' : 'tv'
  const [FilterModal, setFilterModal] = useState(false)

  const handleClearFilters = () => {
    setFilters({ sort_by: 'popularity.desc' })
    setSelectedProviders([])
    setSelectedKeywords([])
    setSelectedPeople([])
    setOriginCountry('')
    setOriginalLanguage('')
    setPrimaryDate('')
    setGenres([])
    SetVoteCount('')
    setVoteAverage({ gte: '', lte: '' })
    setRuntime({ gte: '', lte: '' })
    setDate({ gte: null, lte: null })
    setIncludeAdult(false)
    setSortOption('popularity.desc')
  }

  const handleApplyFilters = () => {
    const dateKey = type_ === 'movie' ? 'release_date' : 'first_air_date'
    const yearKey =
      type_ === 'movie' ? 'primary_release_year' : 'first_air_date_year'
    const formatDate = date => {
      if (date) {
        const formattedDate = new Date(date)
        return formattedDate.toLocaleDateString('en-CA')
      }
      return ''
    }
    const date_ = primaryDate
      ? {
          [`${yearKey}`]: primaryDate.getFullYear(),
          [`${dateKey}.gte`]: '',
          [`${dateKey}.lte`]: ''
        }
      : {
          [`${dateKey}.gte`]: formatDate(date?.gte) || '',
          [`${dateKey}.lte`]: formatDate(date?.lte) || '',
          [`${yearKey}`]: ''
        }
    const formattedFilters = {
      sort_by: sortOption,
      with_watch_providers: selectedProviders.join(','),
      include_adult: includeAdult,
      watch_region: watchRegion,
      with_genres: genres.join(','),
      with_keywords: SelectedKeywords.join(','),
      with_people: selectedPeople.map(p => p.id).join(','),
      'with_runtime.gte': runtime.gte,
      'with_runtime.lte': runtime.lte,
      'vote_average.gte': voteAverage?.gte,
      'vote_average.lte': voteAverage?.lte,
      'vote_count.gte': voteCount,
      with_origin_country: originCountry,
      with_original_language: originalLanguage,
      ...date_
    }

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
    const sanitizedFilters = sanitizeFilters(formattedFilters)
    setFilters(sanitizedFilters)
  }
  return (
    <>
      {' '}
      <span
        className='fixed md:hidden bottom-36 right-3 p-3 bg-blue-500 rounded-full z-50'
        onClick={() => setFilterModal(prev => !prev)}
      >
        <FiFilter />
      </span>
      <div
        className={`text-sm space-y-3 left-0 top-0 max-md:w-screen max-md:h-screen fixed md:sticky md:top-20 md:overflow-y-scroll py-4 md:px-3 max-md:bg-black/80 max-md:backdrop-blur-md flex flex-col justify-center pb-48 px-9 max-md:${
          FilterModal ? 'flex' : 'hidden'
        }`}
        onClick={() => setFilterModal(false)}
      >
        <div className='space-y-3 block' onClick={e => e.stopPropagation()}>
          <div className='w-full flex'>
            <button
              className='bg-slate-700 p-3 rounded-full animate-bounce active:animate-ping'
              title='Remove filters'
              onClick={() => setFilters({})}
            >
              <RiArrowGoBackFill className='mx-auto' />
            </button>
          </div>
          <SortType
            sortOption={sortOption}
            setSortOption={setSortOption}
            openedModal={openedModal}
            setOpenedModal={setOpenedModal}
            type_={type_}
          />
          <ServiceProvider
            selectedProviders={selectedProviders}
            setSelectedProviders={setSelectedProviders}
            type_={type_}
            openedModal={openedModal}
            setOpenedModal={setOpenedModal}
            watchRegion={watchRegion}
            setWatchRegion={setWatchRegion}
          />
          <Filters
            type={type}
            includeAdult={includeAdult}
            setIncludeAdult={setIncludeAdult}
            genres={genres}
            setGenres={setGenres}
            date={date}
            setDate={setDate}
            primaryDate={primaryDate}
            setPrimaryDate={setPrimaryDate}
            openedModal={openedModal}
            setOpenedModal={setOpenedModal}
            originCountry={originCountry}
            setOriginCountry={setOriginCountry}
            originalLanguage={originalLanguage}
            setOriginalLanguage={setOriginalLanguage}
          />
          <AdvancedFilters
            setSelectedKeywords={setSelectedKeywords}
            SelectedKeywords={SelectedKeywords}
            setSelectedPeople={setSelectedPeople}
            selectedPeople={selectedPeople}
            runtime={runtime}
            setRuntime={setRuntime}
            type_={type_}
            voteAverage={voteAverage}
            setVoteAverage={setVoteAverage}
            voteCount={voteCount}
            SetVoteCount={SetVoteCount}
            openedModal={openedModal}
            setOpenedModal={setOpenedModal}
          />
        </div>

        <div className='flex gap-2'>
          <button
            onClick={handleClearFilters}
            className='w-full flex gap-3 items-center justify-center bg-gray-600 text-white py-2 rounded hover:bg-red-800/70 hover:shadow-lg transition-colors duration-200 ease-in-out'
          >
            <BiTrash className='text-lg' />
            Clear Filters
          </button>

          <button
            onClick={handleApplyFilters}
            className='w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 hover:shadow-lg transition-colors duration-200 ease-in-out'
          >
            Apply Filters
          </button>
        </div>
      </div>
    </>
  )
}

export default FilterOptions
