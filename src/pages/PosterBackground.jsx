import { useEffect, useState, useCallback } from 'react'
import randomizeArray from 'randomize-array'
import html2canvas from 'html2canvas'
import { featured } from '../constants/index'
import '../components/poster-background/index.css'
import { options } from '../utils/api'
import { Link } from 'react-router-dom'

const PosterBackground = () => {
  const [data, setData] = useState([])
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selectedMovie, setSelectedMovie] = useState(null)
  const [resolution, setResolution] = useState('w185') // Default resolution
  const [selectedFeatured, setSelectedFeatured] = useState('default')

  const fetchMovies = useCallback(async () => {
    setLoading(true)
    let endpoint

    if (selectedFeatured === 'default') {
      endpoint =
        'https://api.themoviedb.org/3/trending/all/week?language=en-US&page='
    } else {
      const { type, category } = JSON.parse(selectedFeatured)
      endpoint = `https://api.themoviedb.org/3/${type}/${category}?language=en-US&page=`
    }

    try {
      const fetchPromises = Array.from({ length: 14 }, (_, i) =>
        fetch(`${endpoint}${i + 1}`, options)
          .then(response => response.json())
          .then(jsonData => jsonData.results)
      )

      const resultArrays = await Promise.all(fetchPromises)
      const allMovies = randomizeArray([].concat(...resultArrays))

      const trimmedMovies = allMovies.slice(
        0,
        Math.floor(allMovies.length / 25) * 25
      )
      setData(trimmedMovies)
    } catch (err) {
      setError('Failed to load API data. Please try again later.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [selectedFeatured, resolution])

  useEffect(() => {
    fetchMovies()
  }, [fetchMovies])

  const handleRandomize = useCallback(() => {
    setData(prevData => randomizeArray(prevData))
  }, [])

  const handleDownload = useCallback(async () => {
    const gridElement = document.querySelector('.poster-grid')
    const images = gridElement.querySelectorAll('img')

    // Use CORS proxy for images to avoid CORS issues
    const proxyUrl = 'https://cors-anywhere.herokuapp.com/'

    // Preload images and ensure they are ready
    await Promise.all(
      Array.from(images).map(
        img =>
          new Promise(resolve => {
            // Change image src to go through the CORS proxy
            img.src = `${proxyUrl}https://image.tmdb.org/t/p/${resolution}${
              img.src.split('/t/p/')[1]
            }`

            if (img.complete) {
              resolve()
            } else {
              img.onload = resolve
              img.onerror = resolve
            }
          })
      )
    )

    // Wait for all images to load
    const canvas = await html2canvas(gridElement, {
      useCORS: true, // Allow CORS for images
      scale: 2,
      backgroundColor: null,
      allowTaint: true,
      width: 1980,
      height: 1024
    })

    const link = document.createElement('a')
    link.download = 'poster-grid.png'
    link.href = canvas.toDataURL('image/png')
    link.click()
  }, [])

  const handleMovieClick = useCallback(movie => {
    setSelectedMovie(movie)
  }, [])

  if (loading) return <div className='loading'>Loading...</div>
  if (error) return <div className='error'>{error}</div>

  return (
    <div className='poster-page'>
      <div className='header'>
        <select
          className='action-select'
          value={selectedFeatured}
          onChange={e => setSelectedFeatured(e.target.value)}
        >
          <option value='default'>Trending (Default)</option>
          {featured.map((option, index) => (
            <option key={index} value={JSON.stringify(option)}>
              {option.title}
            </option>
          ))}
        </select>
        <select
          className='action-select'
          value={resolution}
          onChange={e => setResolution(e.target.value)}
        >
          <option value='w92'>Low Quality (w92)</option>
          <option value='w185'>Medium Quality (w185)</option>
          <option value='w342'>High Quality (w342)</option>
          <option value='w500'>Ultra Quality (w500)</option>
        </select>
        <button className='action-button' onClick={handleRandomize}>
          Randomize Images
        </button>
        <button className='action-button' onClick={handleDownload}>
          Download Grid
        </button>
      </div>
      <div className='poster-grid'>
        {data.map((movie, i) =>
          movie.poster_path ? (
            <div
              key={i}
              className='poster-wrapper'
              onClick={() => handleMovieClick(movie)}
            >
              <img
                src={`https://image.tmdb.org/t/p/${resolution}${movie.poster_path}`}
                alt={movie.title || movie.name}
                className='poster-image_'
                crossOrigin='anonymous' // Ensure the image fetch is CORS enabled
              />
            </div>
          ) : null
        )}
      </div>
      {selectedMovie && (
        <div className='movie-modal'>
          <div className='modal-content'>
            <button
              className='close-button'
              onClick={() => setSelectedMovie(null)}
            >
              &times;
            </button>

            <div className='modal-image-wrapper'>
              {selectedMovie.poster_path ? (
                <img
                  src={`https://image.tmdb.org/t/p/w342${selectedMovie.poster_path}`}
                  alt={selectedMovie.title || selectedMovie.name}
                  className='modal-image mx-auto'
                />
              ) : (
                <div className='no-image'>No Image Available</div>
              )}
            </div>

            <div className='modal-details'>
              <h2>{selectedMovie.title || selectedMovie.name}</h2>
              {selectedMovie.release_date && (
                <p>Release Date: {selectedMovie.release_date}</p>
              )}
              {selectedMovie.first_air_date && (
                <p>First Air Date: {selectedMovie.first_air_date}</p>
              )}
              {selectedMovie.vote_average && (
                <p>Rating: {selectedMovie.vote_average}/10</p>
              )}
              <p>{selectedMovie.overview || 'No description available.'}</p>

              {selectedMovie.id && (
                <Link
                  to={`/${
                    selectedMovie.media_type === 'tv'
                      ? 'series'
                      : selectedMovie.media_type
                  }/${selectedMovie.id}`}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='modal-link'
                >
                  View details
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default PosterBackground
