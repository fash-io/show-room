import axios from 'axios'
import { options } from './api'

export const fetchLogos = async show => {
  const logos = {}

  for (const movie of show) {
    try {
      const response = await axios.get(
        `https://api.themoviedb.org/3/${movie.media_type}/${movie.id}/images`,
        options
      )
      const data = response.data

      if (data.logos && data.logos.length > 0) {
        const filteredLogos = data.logos.filter(logo => logo.iso_639_1 === 'en')

        if (filteredLogos.length > 0) {
          logos[movie.id] = filteredLogos[0].file_path
        } else {
          logos[movie.id] = data.logos[0].file_path
        }
      }
    } catch (err) {
      console.error('Failed to fetch logos', err)
    }
  }

  return { ...logos }
}
