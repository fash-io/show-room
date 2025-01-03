export const options = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: 'Bearer ' + import.meta.env.TMDB_API_KEY
  }
}

export const fetchDetails = async (id, type) => {
  try {
    const response = await fetch(
      `https://api.themoviedb.org/3/${
        type === 'movie' ? 'movie' : 'tv'
      }/${id}?language=en-US`,
      options
    )
    const data = await response.json()
    return { ...data, type }
  } catch (error) {
    console.error(`Error fetching details for ${type} with ID ${id}:`, error)
    return null
  }
}

export const fetchWatchlistData = async (
  setLoading,
  setError,
  setFavorites,
  setWatchlist,
  setWatched,
  userData,
  user
) => {
  if (!user) {
    setLoading(false)
    return
  }
  try {
    setLoading(true)

    const watchListItems = userData.watchList || []
    const favoriteItems = userData.favorite || []
    const watchedItems = userData.watched || []

    const favoriteDetails = await Promise.all(
      favoriteItems.map(async item => {
        const details = await fetchDetails(item.id, item.type)
        return details
      })
    )

    const watchlistDetails = await Promise.all(
      watchListItems.map(async item => {
        const details = await fetchDetails(item.id, item.type)
        return details
      })
    )

    const watchedDetails = await Promise.all(
      watchedItems.map(async item => {
        const details = await fetchDetails(item.id, item.type)
        return details
      })
    )

    setFavorites(favoriteDetails.filter(item => item !== null))
    setWatchlist(watchlistDetails.filter(item => item !== null))
    setWatched(watchedDetails.filter(item => item !== null))
  } catch (err) {
    setError('Failed to load data.')
    console.error(err)
  } finally {
    setLoading(false)
  }
}
