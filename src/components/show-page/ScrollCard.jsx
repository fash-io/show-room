/* eslint-disable react/prop-types */
import { Link } from 'react-router-dom'

const ScrollCard = ({ person }) => {
  return (
    <Link key={person.id} to={`/person/${person.id}`}>
      <div className='w-[10.5rem] bg-white/10 p-0.5 group'>
        <div className='overflow-hidden'>
          <img
            src={
              person.profile_path
                ? `https://image.tmdb.org/t/p/w300${person.profile_path}`
                : 'https://via.placeholder.com/150x225?text=No+Image'
            }
            alt={person.name}
            className='md:group-hover:scale-110 duration-300'
          />
        </div>
        <div className=' py-2 px-1'>
          <p className='font-semibold text-sm'>{person.name}</p>
          {person.character && (
            <p className='text-xs text-gray-400'>as {person.character}</p>
          )}
        </div>
      </div>
    </Link>
  )
}

export default ScrollCard
