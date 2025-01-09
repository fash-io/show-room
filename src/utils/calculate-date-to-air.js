export const calculateDaysToNextEpisode = airDate => {
  const currentDate = new Date()
  const episodeDate = new Date(airDate)

  // Calculate the difference in milliseconds and convert to days
  const differenceInTime = episodeDate - currentDate
  const differenceInDays = Math.ceil(differenceInTime / (1000 * 60 * 60 * 24))

  return differenceInDays
}
