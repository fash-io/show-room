import { useState, useEffect } from 'react'
import axios from 'axios'
import { options } from '../utils/api'
import { Link } from 'react-router-dom'
import Loading from '../components/Loaders/Loading'

const TopPeople = () => {
  const [topPeople, setTopPeople] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    const fetchTopPeople = async () => {
      try {
        setLoading(true)
        const response = await axios.get(
          `https://api.themoviedb.org/3/person/popular?language=en-US&page=${page}`,
          options
        )
        setTopPeople(response.data.results)
        setTotalPages(response.data.total_pages)
        setLoading(false)
      } catch (error) {
        console.error('Error fetching top people:', error)
        setLoading(false)
      }
    }

    fetchTopPeople()
  }, [page])

  const handlePreviousPage = () => {
    if (page > 1) setPage(prev => prev - 1)
  }

  const handleNextPage = () => {
    if (page < totalPages) setPage(prev => prev + 1)
  }

  if (loading) return <Loading />

  return (
    <div className='text-white min-h-screen p-8'>
      <div className='max-w-7xl mx-auto pt-20'>
        <h1 className='text-5xl font-bold mb-8 text-center text-blue-400'>
          Top People
        </h1>
        <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6'>
          {topPeople.map(person => (
            <Link
              key={person.id}
              to={`/person/${person.id}`}
              className='group bg-white/10 p-6 rounded-xl shadow-lg transition-all transform hover:scale-105 hover:shadow-xl'
            >
              <img
                src={`https://image.tmdb.org/t/p/w300${person.profile_path}`}
                alt={person.name}
                className='w-full h-60 object-cover rounded-xl mb-4'
              />
              <h2 className='text-xl font-semibold group-hover:text-blue-400 duration-200'>
                {person.name}
              </h2>
              <p className='text-sm text-gray-400'>
                Popularity: {person.popularity.toFixed(1)}
              </p>
            </Link>
          ))}
        </div>
        <div className='flex justify-between items-center mt-8'>
          <button
            onClick={handlePreviousPage}
            disabled={page === 1}
            className='px-6 py-3 bg-blue-600 text-white rounded-md disabled:opacity-50 transition-all hover:bg-blue-500'
          >
            Previous
          </button>
          <p className='text-lg'>
            Page {page} of {totalPages}
          </p>
          <button
            onClick={handleNextPage}
            disabled={page === totalPages}
            className='px-6 py-3 bg-blue-600 text-white rounded-md disabled:opacity-50 transition-all hover:bg-blue-500'
          >
            Next
          </button>
        </div>
      </div>
    </div>
  )
}

export default TopPeople
