/* eslint-disable react/prop-types */
import { Link } from 'react-router-dom'

const ScrollCard = ({ person }) => {
  return (
    <Link key={person.id} to={`/person/${person.id}`}>
      <div className='flex-shrink-0 w-[9rem] sm:w-44 divvv group'>
        <div className='overflow-hidden w-full h-full'>
          <img
            src={
              person.profile_path
                ? `https://image.tmdb.org/t/p/w300${person.profile_path}`
                : 'https://via.placeholder.com/150x225?text=No+Image'
            }
            alt={person.name}
            className='w-full h-[11rem] object-top object-cover z-50 group-hover:scale-110 duration-500'
          />
        </div>
        <div className='divv pt-2 bg-[#191919] '>
          <div className='absolute z-50 px-1 h-full flex flex-col justify-between pb-5 pr-7'>
            <p className='text-center font-semibold text-sm sm:text-base duration-200  hover:text-white group-hover:text-white'>
              {person.name}
            </p>
            {person.character && (
              <p className=' text-xs sm:text-sm  group-hover:text-gray-200 duration-200 text-gray-400'>
                as {person.character}
              </p>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}

export default ScrollCard
