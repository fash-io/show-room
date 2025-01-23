/* eslint-disable react/prop-types */
import { useState, useEffect, useRef, useCallback } from 'react'
import { FaTrash } from 'react-icons/fa'
import MultiRangeSlider from '../MultiRangeSlider'
import { BiSolidRightArrow } from 'react-icons/bi'
import { fetchData } from '../../utils/tmdbfetch'
import { BsPerson } from 'react-icons/bs'
import axios from 'axios'
import { options } from '../../utils/api'

const AdvancedFilters = ({
  setSelectedKeywords,
  SelectedKeywords,
  setSelectedPeople,
  selectedPeople,
  runtime,
  setRuntime,
  type_,
  openedModal,
  setOpenedModal,
  voteAverage,
  setVoteAverage,
  voteCount,
  SetVoteCount
}) => {
  const [keywordSearch, setKeywordSearch] = useState('')
  const [personSearch, setPersonSearch] = useState('')
  const [people, setPeople] = useState([])
  const modalRef = useRef(null)
  const [keywords, setKeywords] = useState([])
  const [loadingPeople, setLoadingPeople] = useState(false)
  const [loadingKeyword, setLoadingKeyword] = useState(false)

  useEffect(() => {
    if (keywordSearch.length > 2) {
      setLoadingKeyword(true)
      fetchData({
        url: `https://api.themoviedb.org/3/search/keyword?query=${keywordSearch}&page=1`,
        setData: setKeywords
      }).finally(() => setLoadingKeyword(false))
    }

    if (personSearch.length > 2) {
      setLoadingPeople(true)
      fetchData({
        url: `https://api.themoviedb.org/3/search/person?query=${personSearch}&include_adult=true&language=en-US&page=1`,
        setData: setPeople
      }).finally(() => setLoadingPeople(false))
    }
  }, [type_, keywordSearch, personSearch])

  const [keywordNames, setKeywordNames] = useState({})

  useEffect(() => {
    const fetchKeywordDetails = async () => {
      const fetches = SelectedKeywords.map(async keywordId => {
        if (!keywordNames[keywordId]) {
          try {
            const res = await fetch(
              `https://api.themoviedb.org/3/keyword/${keywordId}`,
              options
            )
            const data = await res.json()
            return { id: keywordId, name: data.name }
          } catch (error) {
            console.error(`Error fetching keyword ${keywordId}:`, error)
            return { id: keywordId, name: 'Unknown' }
          }
        }
        return { id: keywordId, name: keywordNames[keywordId] }
      })

      const results = await Promise.all(fetches)
      const updatedNames = results.reduce((acc, { id, name }) => {
        acc[id] = name
        return acc
      }, {})
      setKeywordNames(prev => ({ ...prev, ...updatedNames }))
    }

    fetchKeywordDetails()
  }, [SelectedKeywords, keywordNames])

  const handleClickOutside = useCallback(
    e => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        setPersonSearch('')
        setPeople([])
      }
    },
    [setPersonSearch, setPeople]
  )

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [handleClickOutside])

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
      className={`bg-slate-900 shadow-lg rounded  max-h-[45vh] overflow-y-scroll`}
    >
      <div
        className='flex px-4 py-4 items-center justify-between cursor-pointer text-slate-300 sticky top-0 bg-slate-900 border-slate-800 border-b z-10 shadow'
        onClick={() =>
          setOpenedModal(prev => (prev !== 'adv_filter' ? 'adv_filter' : ''))
        }
      >
        <span className='font-medium text-sm'>Extra filters</span>
        <BiSolidRightArrow
          className={`duration-300 transform ${
            openedModal === 'adv_filter' && 'rotate-90'
          }`}
        />
      </div>

      {openedModal === 'adv_filter' && (
        <div className='rounded-b w-full' ref={modalRef}>
          <div className='p-2 border-y border-slate-800 space-y-3'>
            <label className='flex flex-wrap gap-2 items-center justify- font-medium text-slate-300 mb-2'>
              Keywords
            </label>
            <div className='relative'>
              <input
                type='text'
                className='w-full h-full p-3 bg-gray-900 text-white rounded border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all'
                placeholder='Search keywords...'
                value={keywordSearch}
                onChange={e => setKeywordSearch(e.target.value)}
              />
              {loadingKeyword && (
                <span className='h-3 top-4 right-2 border-l-transparent animate-spin rounded-full absolute aspect-square border'></span>
              )}
            </div>
            <div className='flex gap-1 px-2 flex-wrap'>
              {SelectedKeywords.map(keyword => {
                return (
                  <div
                    key={keyword}
                    className='bg-slate-950 text-white rounded inline items-center space-x-2 p-1'
                  >
                    <span>{keywordNames[keyword] || 'Loading...'}</span>
                    <button
                      className='text-sm hover:text-red-400'
                      onClick={() =>
                        setSelectedKeywords(prev =>
                          prev.filter(kid => kid !== keyword)
                        )
                      }
                    >
                      &times;
                    </button>
                  </div>
                )
              })}
            </div>

            {keywordSearch && (
              <div className='mt-4 flex flex-wrap gap-2'>
                {keywords
                  .filter(keyword => keyword.name.toLowerCase())
                  .map(keyword => (
                    <button
                      key={keyword.id}
                      className='bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-colors'
                      onClick={() => {
                        setSelectedKeywords(prev => [...prev, keyword.id])
                        setKeywordSearch('')
                        setKeywords([])
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
            <div className='relative'>
              <input
                type='text'
                className='w-full p-3 bg-gray-900 text-white rounded border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all'
                placeholder='Actors & directors'
                value={personSearch}
                onChange={e => setPersonSearch(e.target.value)}
              />
              {loadingPeople && (
                <span className='h-3 top-4 right-2 border-l-transparent animate-spin rounded-full absolute aspect-square border'></span>
              )}
            </div>

            {/* Selected People */}
            {selectedPeople.length > 0 && (
              <div className='flex flex-wrap gap-1'>
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
              <div className='absolute top-20 sm:left-0 max-h-96 w-full bg-slate-800 overflow-y-auto rounded z-[60]'>
                {people.length > 0 ? (
                  people.map(person => (
                    <div
                      key={person.id}
                      className='w-full p-2 flex justify-between items-center hover:bg-gray-700 cursor-pointer'
                      onClick={() => handleAddPerson(person)}
                    >
                      <span className='text-sm'>{person.name}</span>
                      {person.profile_path ? (
                        <img
                          src={`https://image.tmdb.org/t/p/w200${person.profile_path}`}
                          alt={person.name}
                          className='w-9 h-9 rounded-full object-cover'
                        />
                      ) : (
                        <BsPerson />
                      )}
                    </div>
                  ))
                ) : loadingPeople ? (
                  <></>
                ) : (
                  <div className='text-center text-gray-400'>
                    No results found
                  </div>
                )}
              </div>
            )}
          </div>

          {/* <div className='p-4 border-y border-slate-800 space-y-2'>
            <label className='block text-sm font-medium text-slate-300'>
              Runtime
            </label>
            <span className='block text-xs text-slate-400'>
              {Math.floor(runtime.gte / 60)}hrs {runtime.gte % 60}min -{' '}
              {Math.floor(runtime.lte / 60)}hrs {runtime.lte % 60}min
            </span>
            <MultiRangeSlider
              min={0}
              max={type_ === 'movie' ? 400 : 200}
              onChange={({ min, max }) => {
                setRuntime({ gte: min, lte: max })
              }}
            />
          </div> */}
          {/* <div className='p-4 border-y border-slate-800 space-y-2'>
            <label className='block text-sm font-medium text-slate-300'>
              Vote Average
            </label>
            <span className='block text-xs text-slate-400'>
              {voteAverage.gte} - {voteAverage.lte}
            </span>
            <MultiRangeSlider
              min={0}
              max={10}
              onChange={({ min, max }) => {
                setVoteAverage({ gte: min, lte: max })
              }}
            />
          </div> */}
          {/* <div className='p-4 border-y border-slate-800 space-y-2'>
            <label className='block text-sm font-medium text-slate-300'>
              Vote Count (least)
            </label>
            <span className='block text-xs text-slate-400'>{voteCount}</span>
            <input
              className='w-full'
              type='range'
              min={1}
              value={voteCount}
              max={1000}
              onChange={e => {
                SetVoteCount(e.target.value)
              }}
            />
          </div> */}
        </div>
      )}
    </div>
  )
}

export default AdvancedFilters
