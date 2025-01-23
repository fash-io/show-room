/* eslint-disable react/prop-types */
import { BiSolidRightArrow } from 'react-icons/bi'
import { movieGenre, tvGenre } from '../../constants'
import { useEffect, useState } from 'react'
import { fetchData } from '../../utils/tmdbfetch'
import DropdownWithOutsideClick from './DropdownWithOutsideClick '
import { CgClose } from 'react-icons/cg'

const Filters = ({
  type,
  includeAdult,
  setIncludeAdult,
  genres,
  setGenres,
  date,
  setDate,
  openedModal,
  setOpenedModal,
  originCountry,
  setOriginCountry,
  originalLanguage,
  setOriginalLanguage
}) => {
  const genre = type === 'movies' ? movieGenre : tvGenre
  const [regions, setRegions] = useState([])
  const [languages, setLanguages] = useState([])
  const [isRegionDropdownOpen, setIsRegionDropdownOpen] = useState(false)
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false)
  const [searchCountryQuery, setSearchCountryQuery] = useState('')
  const [searchLanguageQuery, setSearchLanguageQuery] = useState('')

  const handleGenre = _id => {
    setGenres(prevGenres =>
      prevGenres.some(id => id === _id)
        ? prevGenres.filter(id => id !== _id)
        : [...prevGenres, _id]
    )
  }

  useEffect(() => {
    const fetchRegions = async () => {
      try {
        fetchData({
          url: `https://api.themoviedb.org/3/configuration/countries`,
          single: true,
          useTryCatch: false,
          setData: setRegions
        })
        fetchData({
          url: `https://api.themoviedb.org/3/configuration/languages`,
          single: true,
          useTryCatch: false,
          setData: setLanguages
        })
      } catch (error) {
        console.error('Failed to fetch regions:', error)
      }
    }

    fetchRegions()
  }, [])

  const filteredRegions = regions.filter(region =>
    region.english_name.toLowerCase().includes(searchCountryQuery.toLowerCase())
  )
  const filteredLanguages = languages.filter(language =>
    language.english_name
      .toLowerCase()
      .includes(searchLanguageQuery.toLowerCase())
  )

  return (
    <div
      className={`bg-slate-900 shadow-lg rounded max-h-[45vh] overflow-y-scroll`}
    >
      {/* Header */}
      <div
        className='flex px-4 py-4 items-center justify-between cursor-pointer text-slate-300 sticky top-0 bg-slate-900 border-slate-800 border-b z-10 shadow'
        onClick={() =>
          setOpenedModal(prev => (prev !== 'filter' ? 'filter' : ''))
        }
      >
        <span className='font-medium text-sm'>Filters</span>
        <BiSolidRightArrow
          className={`duration-300 transform ${
            openedModal === 'filter' && 'rotate-90'
          }`}
        />
      </div>

      {/* Filters Modal */}
      {openedModal === 'filter' && (
        <div className='rounded-b w-full'>
          {/* Include Adult Content */}
          <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 border-y border-slate-800 text-sm'>
            <label htmlFor='adult' className='font-medium text-slate-300'>
              Include Adult Content
            </label>
            <div className='flex items-center'>
              <input
                type='checkbox'
                id='adult'
                checked={includeAdult}
                onChange={e => setIncludeAdult(e.target.checked)}
                className='ui-checkbox'
              />
            </div>
          </div>

          {/* Release Date */}
          <div className='p-4 border-y border-slate-800 space-y-4 text-sm'>
            <label className='block text-base font-medium text-slate-400'>
              Release Date
            </label>
            <div className='space-y-3'>
              <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between'>
                <span className='text-slate-300'>From</span>
                <input
                  type='date'
                  value={date.gte}
                  onChange={e =>
                    setDate(prev => ({ ...prev, gte: e.target.value }))
                  }
                  className='w-full sm:w-32 p-2 bg-slate-800 text-slate-300 rounded border border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                />
              </div>
              <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between'>
                <span className='text-slate-300'>To</span>
                <input
                  type='date'
                  value={date.lte}
                  onChange={e =>
                    setDate(prev => ({ ...prev, lte: e.target.value }))
                  }
                  className='w-full sm:w-32 p-2 bg-slate-800 text-slate-300 rounded border border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                />
              </div>
            </div>
          </div>

          {/* Original Language */}
          <div className='p-4 border-y border-slate-800 space-y-4'>
            <label className='text-sm font-semibold text-slate-400'>
              Original Language
            </label>
            <div className='relative'>
              <button
                className='w-full p-2 bg-slate-800 text-slate-300 rounded border border-slate-700 text-left flex items-center gap-2'
                onClick={() => setIsLanguageDropdownOpen(prev => !prev)}
              >
                {originalLanguage && (
                  <button
                    className='absolute right-2 top-1/2 -translate-y-1/2 hover:text-red-700 duration-100'
                    onClick={e => {
                      e.stopPropagation()
                      setOriginalLanguage()
                    }}
                  >
                    <CgClose />
                  </button>
                )}
                {originalLanguage
                  ? languages.find(l => l.iso_639_1 === originalLanguage)
                      ?.english_name || 'Select Language'
                  : 'Select Language'}
              </button>
              {isLanguageDropdownOpen && (
                <DropdownWithOutsideClick
                  isOpen={isLanguageDropdownOpen}
                  setIsOpen={setIsLanguageDropdownOpen}
                  className='absolute top-0 left-0 w-full bg-slate-900 border border-slate-800 shadow-lg rounded z-10'
                >
                  <input
                    type='text'
                    placeholder='Search languages...'
                    value={searchLanguageQuery}
                    onChange={e => setSearchLanguageQuery(e.target.value)}
                    className='w-full px-4 py-2 text-sm bg-slate-800 text-white outline-none placeholder:text-slate-500'
                  />
                  <div className='max-h-40 overflow-y-auto'>
                    {filteredLanguages.length > 0 ? (
                      filteredLanguages.map(language => (
                        <div
                          key={language.iso_639_1}
                          className='px-4 py-2 hover:bg-slate-700 cursor-pointer text-sm text-white'
                          onClick={() => {
                            setOriginalLanguage(language.iso_639_1)
                            setIsLanguageDropdownOpen(false)
                            setSearchLanguageQuery('')
                          }}
                        >
                          {language.english_name}
                        </div>
                      ))
                    ) : (
                      <div className='px-4 py-2 text-sm text-slate-500'>
                        No languages found
                      </div>
                    )}
                  </div>
                </DropdownWithOutsideClick>
              )}
            </div>
          </div>

          <div className='p-4 border-y border-slate-800 space-y-4'>
            <label className='text-sm font-semibold text-slate-400'>
              Origin Country
            </label>
            <div className='relative'>
              <button
                className='w-full p-2 bg-slate-800 text-slate-300 rounded border border-slate-700 text-left flex items-center gap-2'
                onClick={() => setIsRegionDropdownOpen(prev => !prev)}
              >
                {originCountry && (
                  <>
                    <img
                      src={`https://flagcdn.com/w40/${originCountry.toLowerCase()}.png`}
                      alt={`${originCountry} flag`}
                      className='w-5 h-3 rounded-sm'
                    />
                    <button
                      className='absolute right-2 top-1/2 -translate-y-1/2 hover:text-red-700 duration-100'
                      onClick={e => {
                        e.stopPropagation()
                        setOriginCountry('')
                      }}
                    >
                      <CgClose />
                    </button>
                  </>
                )}
                {originCountry
                  ? regions.find(r => r.iso_3166_1 === originCountry)
                      ?.english_name || 'Select Country'
                  : 'Select Country'}
              </button>
              {isRegionDropdownOpen && (
                <DropdownWithOutsideClick
                  isOpen={isRegionDropdownOpen}
                  setIsOpen={setIsRegionDropdownOpen}
                  className='absolute top-0 left-0 w-full bg-slate-900 border border-slate-800 shadow-lg rounded z-10'
                >
                  <input
                    type='text'
                    placeholder='Search countries...'
                    value={searchCountryQuery}
                    onChange={e => setSearchCountryQuery(e.target.value)}
                    className='w-full px-4 py-2 text-sm bg-slate-800 text-white outline-none placeholder:text-slate-500'
                  />
                  <div className='max-h-40 overflow-y-auto'>
                    {filteredRegions.length > 0 ? (
                      filteredRegions.map(region => (
                        <div
                          key={region.iso_3166_1}
                          className='px-4 py-2 hover:bg-slate-700 cursor-pointer text-sm text-white flex items-center gap-2'
                          onClick={() => {
                            setOriginCountry(region.iso_3166_1)
                            setIsRegionDropdownOpen(false)
                            setSearchCountryQuery('')
                          }}
                        >
                          <img
                            src={`https://flagcdn.com/w40/${region.iso_3166_1.toLowerCase()}.png`}
                            alt={`${region.english_name} flag`}
                            className='w-5 h-3 rounded-sm'
                          />
                          <span>{region.english_name}</span>
                        </div>
                      ))
                    ) : (
                      <div className='px-4 py-2 text-sm text-slate-500'>
                        No countries found
                      </div>
                    )}
                  </div>
                </DropdownWithOutsideClick>
              )}
            </div>
          </div>
          {/* Genres */}
          <div className='p-4 border-y border-slate-800 space-y-3'>
            <label className='text-sm font-semibold text-slate-400'>
              Genres
            </label>
            <div className='flex flex-wrap gap-3'>
              {genre.map(({ id, name }) => {
                const isSelected = genres.includes(id)
                return (
                  <span
                    key={id}
                    onClick={() => handleGenre(id)}
                    className={`px-4 py-1.5 text-sm rounded-full border cursor-pointer transition-colors 
                      ${
                        isSelected
                          ? 'bg-blue-600 text-white border-blue-600 shadow-md hover:bg-blue-700'
                          : 'bg-transparent text-slate-300 border-slate-600 hover:bg-slate-800 hover:border-slate-400'
                      }`}
                  >
                    {name}
                  </span>
                )
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Filters
