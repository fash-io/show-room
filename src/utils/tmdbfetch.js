import axios from 'axios'
import { options } from './api'
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
    response.status === 200
      ? single
        ? setData(response.data)
        : setData(response.data.results)
      : setError(response.statusText)
    return
  }

  setLoading && setLoading(true)
  try {
    const response = await axios.get(url, options)
    if (response.status === 200) {
      if (single) {
        setData(response.data || {})
      } else {
        setData(response.data.results || [])
        setTotalPages && setTotalPages(response.data.total_pages || 0)
      }
    } else {
      setError && setError(response.statusText)
    }
  } catch (err) {
    console.error(err)
    setError(err.message)
  } finally {
    setLoading && setLoading(false)
  }
}

export const fetchTrailer = async (type, id, setTrailerUrl) => {
  const response = await axios.get(
    `https://api.themoviedb.org/3/${
      type === 'series' ? 'tv' : type
    }/${id}/videos?language=en-US`,
    options
  )
  const trailer = response.data.results.find(
    video => video.type === 'Trailer' && video.site === 'YouTube'
  )
  if (trailer) {
    if (setTrailerUrl) setTrailerUrl(trailer)
    else return trailer
  }
}
