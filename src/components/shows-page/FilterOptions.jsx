/* eslint-disable react/prop-types */
import { useState } from 'react'
import SortType from './SortType'
import ServiceProvider from './ServiceProvider'
import Filters from './Filters'
import AdvancedFilters from './AdvancedFilters'
import { BiTrash } from 'react-icons/bi'
import { FiFilter } from 'react-icons/fi'
import { RiArrowGoBackFill } from 'react-icons/ri'

const FilterOptions = ({ setFilters, type, filters }) => {
  console.log(filters)
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
  const [filterModal, setFilterModal] = useState(false)

  const type_ = type === 'movies' ? 'movie' : 'tv'

  console.log(selectedProviders)

  const handleClearFilters = () => {
    setFilters({ sort_by: 'popularity.desc' })
    setSelectedProviders([])
    setSelectedKeywords([])
    setSelectedPeople([])
    setOriginCountry('')
    setOriginalLanguage('')
    setGenres([])
    SetVoteCount('')
    setVoteAverage({ gte: '', lte: '' })
    setRuntime({ gte: '', lte: '' })
    setDate({ gte: null, lte: null })
    setIncludeAdult(false)
    setSortOption('popularity.desc')
  }

  const handleApplyFilters = () => {
    const dateKey = type_ === 'tv' ? 'first_air_date' : 'release_date'
    const formattedFilters = {
      sort_by: sortOption,
      with_watch_providers: selectedProviders.map(p => p).join(','),
      include_adult: includeAdult,
      watch_region: watchRegion,
      with_genres: genres.map(g => g).join(','),
      with_keywords: SelectedKeywords.map(k => k).join(','),
      with_people: selectedPeople.map(p => p.id).join(','),
      'with_runtime.gte': runtime.gte,
      'with_runtime.lte': runtime.lte,
      'vote_average.gte': voteAverage?.gte,
      'vote_average.lte': voteAverage?.lte,
      'vote_count.gte': voteCount,
      with_origin_country: originCountry,
      with_original_language: originalLanguage,
      [`${dateKey}.gte`]: date?.gte,
      [`${dateKey}.lte`]: date?.lte
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
    <div className='text-sm space-y-3 sticky top-20 overflow-y-scroll py-4 px-3 '>
      <div className='hidden space-y-3 md:block '>
        <div className='w-full flex '>
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

      {/* Modal trigger for small screens */}
      <div className='md:hidden '>
        <button
          onClick={() => setFilterModal(true)}
          className='p-3 bg-blue-500 text-white rounded-full fixed left-5 bottom-20 hover:bg-blue-600'
        >
          <FiFilter />
        </button>
        {filterModal && (
          <div
            className='fixed inset-0 bg-black/50 flex justify-center items-center z-50'
            onClick={() => setFilterModal(false)}
          >
            <div
              className='bg-gray-800 text-white p-6 rounded-lg w-11/12 md:w-1/3'
              onClick={e => e.stopPropagation()}
            >
              <div className='space-y-4'>
                <SortType
                  sortOption={sortOption}
                  setSortOption={setSortOption}
                  openedModal={openedModal}
                  setOpenedModal={setOpenedModal}
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
              <div className='mt-4 flex justify-between'>
                <button
                  onClick={handleClearFilters}
                  className='bg-red-600 py-2 px-4 rounded text-white'
                >
                  Clear Filters
                </button>
                <button
                  onClick={handleApplyFilters}
                  className='bg-green-600 py-2 px-4 rounded text-white'
                >
                  Apply Filters
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Buttons for large screens */}
      <div className='space-y-3 hidden md:block'>
        <button
          onClick={handleClearFilters}
          className='w-full flex gap-3 items-center justify-center bg-gray-600 text-white py-2 rounded hover:bg-red-600 hover:shadow-lg transition-colors duration-200 ease-in-out'
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
  )
}

export default FilterOptions
