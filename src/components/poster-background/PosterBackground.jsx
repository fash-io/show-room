import { useEffect, useState, useCallback, useMemo } from 'react'
import { options } from '../../utils/api'
import randomizeArray from 'randomize-array'
import './index.css'

const PosterBackground = ({ className, handleShowSelect, selectedShow }) => {
  const [error, setError] = useState(null)
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [tooltip, setTooltip] = useState({
    visible: false,
    content: '',
    x: 0,
    y: 0
  })

  useEffect(() => {
    const fetchApiData = async () => {
      try {
        const fetchPromises = Array.from({ length: 14 }, (_, i) =>
          fetch(
            `https://api.themoviedb.org/3/trending/all/week?language=en-US&page=${
              i + 1
            }`,
            options
          )
            .then(response => response.json())
            .then(jsonData => jsonData.results)
        )

        const resultArrays = await Promise.all(fetchPromises)

        const allMovies = randomizeArray([].concat(...resultArrays))
        setData(allMovies)
      } catch (err) {
        setError('Failed to load API data. Please try again later.')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchApiData()
  }, [])

  const handleMouseEnter = useCallback((e, movie, i) => {
    setTooltip({
      visible: true,
      index: i,
      content: `${movie.title || movie.name} (${
        movie.media_type === 'movie' ? 'Movie' : 'Series'
      })`,
      x: e.clientX + 15,
      y: e.clientY + 15
    })
  }, [])

  const handleMouseLeave = useCallback(() => {
    setTooltip({ visible: false, i: undefined, content: '', x: 0, y: 0 })
  }, [])

  const handleMouseMove = useCallback(
    e => {
      if (tooltip.visible) {
        setTooltip(prev => ({
          ...prev,
          x: e.clientX + 15,
          y: e.clientY + 15
        }))
      }
    },
    [tooltip.visible]
  )

  const posterElements = useMemo(
    () =>
      data.map((movie, i) => (
        <div
          key={i}
          className={`poster-wrapper cursor-pointer duration-200 ${
            i === tooltip.index || selectedShow.id === movie.id
              ? 'z-50 brightness-110 scale-[1.7] skew-x-[0deg]'
              : tooltip.visible
              ? 'brightness-[0.4] -skew-x-[10deg]'
              : selectedShow.id
              ? 'brightness-[0.4] -skew-x-[10deg]'
              : 'brightness-[0.6] -skew-x-[10deg]'
          }`}
          onMouseEnter={e => handleMouseEnter(e, movie, i)}
          onMouseLeave={handleMouseLeave}
          onClick={() => {
            if (selectedShow.id === movie.id) {
              handleShowSelect()
            } else {
              handleShowSelect(movie)
            }
          }}
        >
          <img
            src={`https://image.tmdb.org/t/p/w185${movie.poster_path}`}
            alt={movie.title || movie.name}
            className='poster-image'
          />
        </div>
      )),
    [
      data,
      handleMouseEnter,
      handleMouseLeave,
      handleShowSelect,
      selectedShow.id,
      tooltip.index,
      tooltip.visible
    ]
  )
  console.log('hi')

  if (loading || error) {
    return <div className='login'></div>
  }
  return (
    <>
      <div
        className={`poster-grid login_2 bg-black ${className}`}
        onMouseMove={handleMouseMove}
      >
        {posterElements}
        {tooltip.visible && (
          <div
            className='tooltip'
            style={{ left: `${tooltip.x}px`, top: `${tooltip.y}px` }}
          >
            {tooltip.content}
          </div>
        )}
      </div>
    </>
  )
}

export default PosterBackground
