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
        let data = []
        for (let i = 1; i <= 14; i++) {
          const response = await fetch(
            `https://api.themoviedb.org/3/trending/all/week?language=en-US&page=${i}`,
            options
          )
          const jsonData = await response.json()
          data = data.concat(jsonData.results)
        }

        setData(randomizeArray(data))
      } catch (err) {
        setError('Failed to load API data. Please try again later.')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchApiData()
  }, [])

  const handleMouseEnter = (e, movie) => {
    setTooltip({
      visible: true,
      content: `${movie.title || movie.name} (${
        movie.media_type === 'movie' ? 'Movie' : 'Series'
      })`,
      x: e.clientX + 15,
      y: e.clientY + 15
    })
  }

  const handleMouseLeave = () => {
    setTooltip({ visible: false, content: '', x: 0, y: 0 })
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

  return (
    <>
      {loading || (error && <div className='login'></div>)}
      <div
        className={`poster-grid login_2 ${className}`}
        onMouseMove={handleMouseMove}
      >
        {data.map((movie, i) => (
          <div
            key={i}
            className='poster-wrapper cursor-pointer'
            onMouseEnter={e => handleMouseEnter(e, movie)}
            onMouseLeave={handleMouseLeave}
            onClick={() => {
              handleShowSelect(movie)
            }}
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
