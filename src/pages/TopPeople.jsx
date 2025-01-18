import { useState, useEffect } from 'react'
import axios from 'axios'
import { options } from '../utils/api'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import Loading from '../components/Loaders/Loading'
import Pagination from '../components/Pagination'

const TopPeople = () => {
  const [topPeople, setTopPeople] = useState([])
  const [loading, setLoading] = useState(true)
  const location = useLocation()
  const navigate = useNavigate()

  const initialPage = new URLSearchParams(location.search).get('page') || 1
  const [page, setPage] = useState(Number(initialPage))
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
      } catch (error) {
        console.error('Error fetching top people:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchTopPeople()
  }, [page])

  // Scroll to the top on page change
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }, [page])

  const handlePageChange = change => {
    let newPage = page

    if (change === 'next') newPage = page + 1
    else if (change === 'previous') newPage = page - 1
    else if (change === 'first') newPage = 1
    else if (change === 'double') newPage = page + 2

    // Prevent navigating to invalid pages
    if (newPage < 1 || newPage > totalPages) return

    navigate(`/top-people?page=${newPage}`)
    setPage(newPage)
  }

  if (loading) return <Loading />

  return (
    <div className='text-white min-h-screen p-8'>
      <div className='max-w-7xl mx-auto pt-10 sm:pt-15 relative'>
        <h1 className='text-5xl font-bold mb-8 text-center text-blue-400'>
          Top People
        </h1>
        <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-10'>
          {topPeople.map(person => (
            <Link
              key={person.id}
              to={`/person/${person.id}`}
              className='group bg-black/10 transition-all p-1 overflow-hidden rounded space-y-2'
            >
              <div className='overflow-hidden max-h-fit rounded border border-white/35 p-1'>
                <img
                  src={`https://image.tmdb.org/t/p/w300${person.profile_path}`}
                  alt={person.name}
                  className='w-full md:group-hover:scale-105 duration-150 object-cover rounded'
                />
              </div>
              <div>
                <h2 className='font-semibold text-sm'>{person.name}</h2>
                <p className='text-sm text-gray-400'>
                  Popularity: {person.popularity.toFixed(1)}
                </p>
              </div>
            </Link>
          ))}
        </div>
        <Pagination
          page={page}
          handlePageChange={handlePageChange}
          totalPages={totalPages}
        />
      </div>
    </div>
  )
}

export default TopPeople
