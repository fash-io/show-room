export const fetchLogos = async (show, options) => {
  const newLogos = {}
  const fallbackLogos = {}

  for (const movie of show) {
    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/${movie.media_type}/${movie.id}/images`,
        options
      )
      const data = await response.json()

      if (data.logos && data.logos.length > 0) {
        const filteredLogos = data.logos.filter(logo => logo.iso_639_1 === 'en')

        if (filteredLogos.length > 0) {
          newLogos[movie.id] = filteredLogos[0].file_path
        } else {
          fallbackLogos[movie.id] = data.logos[0].file_path
        }
      }
    } catch (err) {
      console.error('Failed to fetch logos', err)
    }
  }

  return { ...newLogos, ...fallbackLogos }
}
