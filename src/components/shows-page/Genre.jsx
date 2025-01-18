/* eslint-disable react/prop-types */
import { useState } from 'react'
import GenreSort from './GenreSort'
import GenreProvider from './GenreProvider'
import Filters from './Filters'
import FilterModal from './FilterModal'
import { BiTrash } from 'react-icons/bi'

const Genre = ({ setFilters, type }) => {
  const [selectedProviders, setSelectedProviders] = useState([])
  const [SelectedKeywords, setSelectedKeywords] = useState([])
  const [selectedPeople, setSelectedPeople] = useState([])
  const [date, setDate] = useState([1980, 2020])
  const [includeAdult, setIncludeAdult] = useState(false)
  const [sortOption, setSortOption] = useState('popularity.desc')
  const [genres, setGenres] = useState([])
  const [runtime, setRuntime] = useState({ min: 0, max: 400 })

  const type_ = type === 'movies' ? 'movie' : 'tv'

  const handleClearFilters = () => {
    setFilters({})
    setSelectedProviders([])
    setSelectedKeywords([])
    setSelectedPeople([])
    setGenres([])
    setRuntime({ min: 0, max: 400 })
    setDate([1980, 2020])
    setIncludeAdult(false)
    setSortOption('popularity.desc')
  }

  const handleApplyFilters = () => {
    setFilters(prevFilters => ({
      ...prevFilters,
      with_watch_providers: selectedProviders.map(p => p.provider_id),
      with_keywords: SelectedKeywords.filter(k => k.selected).map(k => k.id),
      with_people: selectedPeople.filter(p => p.selected).map(p => p.id),
      include_adult: includeAdult,
      sort_by: sortOption
    }))
  }

  return (
    <div className='space-y-5 text-sm'>
      <GenreSort sortOption={sortOption} setSortOption={setSortOption} />
      <GenreProvider
        selectedProviders={selectedProviders}
        setSelectedProviders={setSelectedProviders}
        type_={type_}
      />
      <Filters
        genres={genres}
        includeAdult={includeAdult}
        setGenres={setGenres}
        setIncludeAdult={setIncludeAdult}
        type={type}
      />
      <FilterModal
        setSelectedKeywords={setSelectedKeywords}
        SelectedKeywords={SelectedKeywords}
        setSelectedPeople={setSelectedPeople}
        selectedPeople={selectedPeople}
        runtime={runtime}
        setRuntime={setRuntime}
        type_={type_}
      />

      <div className='space-y-3'>
        <button
          onClick={handleClearFilters}
          className='w-full flex gap-3 items-center justify-center bg-gray-600 text-white py-2 rounded-lg 
      hover:bg-red-600 hover:shadow-lg transition-colors duration-200 ease-in-out'
        >
          <BiTrash className='text-lg' />
          Clear Filters
        </button>

        <button
          onClick={handleApplyFilters}
          className='w-full bg-green-600 text-white py-2 rounded-lg 
      hover:bg-green-700 hover:shadow-lg transition-colors duration-200 ease-in-out'
        >
          Apply Filters
        </button>
      </div>
    </div>
  )
}

export default Genre
