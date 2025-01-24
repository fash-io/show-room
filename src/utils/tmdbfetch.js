import axios from 'axios'
import { options } from './api'

/**
 * Fetches data from a given URL and updates state accordingly.
 * @param {Object} params - The parameters for the fetch operation.
 */
export const fetchData = async ({
  url,
  setData,
  single = false,
  setLoading,
  setError,
  useTryCatch = true,
  setTotalPages
}) => {
  if (!useTryCatch) {
    const response = await axios.get(url, options)
    if (response.status === 200) {
      single
        ? setData(response.data || {})
        : setData(response.data.results || [])
    } else {
      setError?.(response.statusText)
    }
    return
  }
  setLoading?.(true)
  try {
    const response = await axios.get(url, options)
    if (response.status === 200) {
      const data = response.data || {}
      if (single) {
        setData(data)
      } else {
        setData(data.results || [])
        setTotalPages?.(data.total_pages || 0)
      }
      return data
    } else {
      setError?.(response.statusText)
    }
  } catch (err) {
    console.error(err)
    setError?.(err.message)
  } finally {
    setLoading?.(false)
  }
}

/**
 * Fetches the trailer URL for a specific type and ID.
 * @param {string} type - The type of media (e.g., "movie" or "series").
 * @param {number} id - The ID of the media item.
 * @param {Function} setTrailerUrl - The state setter for the trailer URL.
 */
export const fetchTrailer = async (type, id, setTrailer) => {
  try {
    const response = await axios.get(
      `https://api.themoviedb.org/3/${type}/${id}/videos?language=en-US`,
      options
    )

    const trailer = response.data.results.find(
      video => video.type === 'Trailer' && video.site === 'YouTube'
    )

    if (trailer) {
      setTrailer && setTrailer(trailer)
      return trailer
    }
  } catch (error) {
    console.error('Error fetching trailer:', error)
  }
}
