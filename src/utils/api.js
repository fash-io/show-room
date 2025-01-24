import axios from 'axios'

const apiKey = `Bearer ${import.meta.env.VITE_TMDB_API_KEY}`
export const options = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: apiKey
  }
}

export const fetchDetails = async (id, type) => {
  try {
    const response = await axios.get(
      `/api/3/${type === 'movie' ? 'movie' : 'tv'}/${id}?language=en-US`,
      options
    )
    console.log(response)
    return { ...response.data, type }
  } catch (error) {
    console.error(`Error fetching details for ${type} with ID ${id}:`, error)
    return null
  }
}

export const fetchWatchListData = async (
  setLoading,
  setError,
  setFavorites,
  setWatchList,
  setWatched,
  userData,
  user
) => {
  if (!user) {
    setLoading(false)
    return
  }
  try {
    setLoading?.(true)

    const fetchItemsDetails = async items =>
      await Promise.all(
        items.map(async item => {
          const details = await fetchDetails(item.id, item.type)
          return details
        })
      )

    const favoriteDetails = await fetchItemsDetails(userData.favorite || [])
    const watchListDetails = await fetchItemsDetails(userData.watchList || [])
    const watchedDetails = await fetchItemsDetails(userData.watched || [])

    setFavorites?.(favoriteDetails.filter(item => item !== null))
    setWatchList?.(watchListDetails.filter(item => item !== null))
    setWatched?.(watchedDetails.filter(item => item !== null))
  } catch (err) {
    setError?.('Failed to load data.')
    console.error('Error fetching watchList data:', err)
  } finally {
    setLoading?.(false)
  }
}
