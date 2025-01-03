import { useEffect, useState } from 'react'
import { options } from '../utils/api'
import randomizeArray from 'randomize-array'

const PosterBackground = () => {
  const [error, setError] = useState(null)
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchApiData = async () => {
      try {
        let data = []
        for (let i = 1; i <= 13; i++) {
          let response = await fetch(
            `https://api.themoviedb.org/3/trending/all?language=en-US&page=${i}`,
            options
          )
          let jsonData = await response.json()
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

  return (
    <div
      className={`fixed z-10 w-screen h-screen ${
        loading || (error && 'login')
      }`}
    >
      <div>
        {data
          .filter((movie, i) => i < 250)
          .map((movie, i) => (
            <div key={i} className='flex flex-wrap'>
              <img src={movie.poster_path} alt='' width={30} height={50} />
            </div>
          ))}
      </div>
    </div>
  )
}

export default PosterBackground
