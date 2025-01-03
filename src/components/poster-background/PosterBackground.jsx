import { useEffect, useState } from 'react'
import { options } from '../../utils/api'
import randomizeArray from 'randomize-array'
import './index.css'

const PosterBackground = ({ className, handleShowSelect }) => {
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
  console.log(loading)

  const handleMouseEnter = (e, movie, i) => {
    setTooltip({
      visible: true,
      index: i,
      content: `${movie.title || movie.name} (${
        movie.media_type === 'movie' ? 'Movie' : 'Series'
      })`,
      x: e.clientX + 15,
      y: e.clientY + 15
    })
  }

  const handleMouseLeave = () => {
    setTooltip({ visible: false, i: undefined, content: '', x: 0, y: 0 })
  }

  const handleMouseMove = e => {
    if (tooltip.visible) {
      setTooltip(prev => ({
        ...prev,
        x: e.clientX + 15,
        y: e.clientY + 15
      }))
    }
  }

  if (loading || error) {
    return <div className='login'></div>
  }
  return (
    <>
      <div
        className={`poster-grid login_2 z-50 bg-black ${className}`}
        onMouseMove={handleMouseMove}
      >
        {data.map((movie, i) => (
          <div
            key={i}
            className={`poster-wrapper cursor-pointer duration-200 ${
              i === tooltip.index
                ? 'brightness-100 z-50'
                : tooltip.visible
                ? 'brightness-50'
                : 'brightness-100'
            }`}
            onMouseEnter={e => handleMouseEnter(e, movie, i)}
            onMouseLeave={handleMouseLeave}
            onClick={() => handleShowSelect(movie)}
          >
            <img
              src={`https://image.tmdb.org/t/p/w185${movie.poster_path}`}
              alt={movie.title || movie.name}
              className='poster-image'
            />
          </div>
        ))}
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
