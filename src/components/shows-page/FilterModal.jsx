/* eslint-disable react/prop-types */
import { useState, useEffect, useRef } from 'react'
import { FaTrash } from 'react-icons/fa'
import { MultiRangeSlider } from '../MultiRangeSlider'
import { BiSolidRightArrow } from 'react-icons/bi'
import { fetchData } from '../../utils/tmdbfetch'
import { BsPerson } from 'react-icons/bs'

const FilterModal = ({
  setSelectedKeywords,
  SelectedKeywords,
  setSelectedPeople,
  selectedPeople,
  runtime,
  setRuntime,
  type_
}) => {
  const [keywordSearch, setKeywordSearch] = useState('')
  const [personSearch, setPersonSearch] = useState('')
  const [people, setPeople] = useState([])
  const modalRef = useRef(null)
  const [isModalOpen, setIsModalOpened] = useState(false)
  const [keywords, setKeywords] = useState([])

  useEffect(() => {
    if (keywordSearch.length > 2) {
      fetchData({
        url: `https://api.themoviedb.org/3/search/keyword?query=${keywordSearch}&page=1`,
        setData: setKeywords
      })
    }

    if (personSearch.length > 2) {
      fetchData({
        url: `https://api.themoviedb.org/3/search/person?query=${personSearch}&include_adult=true&language=en-US&page=1`,
        setData: setPeople
      })
    }
  }, [type_, keywordSearch, personSearch])

  useEffect(() => {
    const handleClickOutside = e => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        setPersonSearch('')
        setPeople([])
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleRemovePerson = id => {
    setSelectedPeople(prev => prev.filter(person => person.id !== id))
  }

  const handleAddPerson = person => {
    if (!selectedPeople.some(p => p.id === person.id)) {
      setSelectedPeople(prev => [...prev, person])
    }
    setPeople([])
    setPersonSearch('')
  }

  return (
    <div
      className={`bg-slate-900 shadow-lg ${
        isModalOpen ? 'rounded-t' : 'rounded'
      }`}
    >
      <div
        className='flex px-4 py-4 items-center justify-between cursor-pointer text-slate-300 hover:bg-slate-800 rounded-t-md'
        onClick={() => setIsModalOpened(prev => !prev)}
      >
        <span className='font-medium text-sm'>Extra filters</span>
        <BiSolidRightArrow
          className={`duration-300 transform ${isModalOpen && 'rotate-90'}`}
        />
      </div>

      {isModalOpen && (
        <div className='rounded-b w-full' ref={modalRef}>
          <div className='p-2 border-y border-slate-800 space-y-3'>
            <label className='flex flex-wrap gap-2 items-center justify- font-medium text-slate-300 mb-2'>
              Keywords
              {SelectedKeywords.map(keyword => {
                return (
                  <div
                    key={keyword.id}
                    className='bg-slate-950 text-white  rounded  inline items-center space-x-2 p-1'
                  >
                    <span>{keyword.name}</span>
                    <button
                      className='text-sm hover:text-red-400'
                      onClick={() =>
                        setSelectedKeywords(prev =>
                          prev.filter(kid => kid.id !== keyword.id)
                        )
                      }
                    >
                      &times;
                    </button>
                  </div>
                )
              })}
            </label>
            <input
              type='text'
              className='w-full p-3 bg-gray-900 text-white rounded border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all'
              placeholder='Search keywords...'
              value={keywordSearch}
              onChange={e => setKeywordSearch(e.target.value)}
            />

            {keywordSearch && (
              <div className='mt-4 flex flex-wrap gap-2'>
                {keywords
                  .filter(keyword =>
                    keyword.name
                      .toLowerCase()
                      .includes(keywordSearch.toLowerCase())
                  )
                  .map(keyword => (
                    <button
                      key={keyword.id}
                      className='bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-colors'
                      onClick={() => {
                        setSelectedKeywords(prev => [...prev, keyword])
                        setKeywordSearch('')
                      }}
                    >
                      {keyword.name}
                    </button>
                  ))}
              </div>
            )}
          </div>

          {/* People Search */}
          <div className='relative p-2 space-y-2'>
            <label className='text-slate-300'>People</label>
            <input
              type='text'
              className='w-full p-3 bg-gray-900 text-white rounded border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all'
              placeholder='Actors & directors'
              value={personSearch}
              onChange={e => setPersonSearch(e.target.value)}
            />

            {/* Selected People */}
            {selectedPeople.length > 0 && (
              <div className=' flex flex-wrap gap-1'>
                {selectedPeople.map(person => (
                  <div key={person.id} className='group relative'>
                    {person.profile_path ? (
                      <img
                        src={`https://image.tmdb.org/t/p/w200${person.profile_path}`}
                        alt={person.name}
                        className='w-10 h-10 rounded-full object-cover'
                      />
                    ) : (
                      <BsPerson />
                    )}

                    <button
                      className='absolute top-0 right-0 left-0 opacity-0 group-hover:opacity-100 duration-200 w-full h-full text-xs flex justify-center items-center bg-red-600 rounded-full '
                      onClick={() => handleRemovePerson(person.id)}
                    >
                      <FaTrash />
                    </button>
                  </div>
                ))}
              </div>
            )}
            {/* Search Results */}
            {personSearch && (
              <div className='absolute top-20  sm:left-0 max-h-96 w-full bg-slate-800 overflow-y-auto rounded'>
                {people.length > 0 ? (
                  people.map(person => (
                    <div
                      key={person.id}
                      className='w-full p-2 flex justify-between items-center hover:bg-gray-700 cursor-pointer'
                      onClick={() => handleAddPerson(person)}
                    >
                      {person.profile_path ? (
                        <img
                          src={`https://image.tmdb.org/t/p/w200${person.profile_path}`}
                          alt={person.name}
                          className='w-9 h-9 rounded-full object-cover'
                        />
                      ) : (
                        <BsPerson />
                      )}
                      <span className='text-sm'>{person.name}</span>
                    </div>
                  ))
                ) : (
                  <div className='text-center text-gray-400'>
                    No results found
                  </div>
                )}
              </div>
            )}
          </div>
          <div className='p-4 border-y border-slate-800 space-y-2'>
            <label className='block text-sm font-medium text-slate-300'>
              Runtime
            </label>
            <span className='block text-xs text-slate-400'>
              {Math.floor(runtime.min / 60)}hrs {runtime.min % 60}min -{' '}
              {Math.floor(runtime.max / 60)}hrs {runtime.max % 60}min
            </span>
            <MultiRangeSlider
              min={0}
              max={400}
              onChange={({ min, max }) => {
                setRuntime({ min, max })
              }}
            />
          </div>
        </div>
      )}
    </div>
  )
}

export default FilterModal
