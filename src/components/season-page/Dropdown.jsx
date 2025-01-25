import { useState } from 'react'
import { BiChevronDown } from 'react-icons/bi'
import { Link } from 'react-router-dom'

const Dropdown = ({ credits }) => {
  const [isOpen, setIsOpen] = useState(false)

  const toggleDropdown = () => setIsOpen(!isOpen)

  return (
    <div className='relative w-72 max-sm:w-full'>
      <button
        onClick={toggleDropdown}
        className='flex items-center justify-between w-full pl-4  py-1 text-white bg-[#1a1a1a] rounded hover:bg-gray-800'
      >
        Guest stars / crew
        <BiChevronDown
          className={`${isOpen ? 'rotate-180' : ''} transition-transform`}
        />
      </button>
      {isOpen && (
        <div className='absolute z-10 w-full mt-2 overflow-y-auto bg-gray-900 border border-gray-700 rounded shadow-md max-h-64'>
          <div className='p-2'>
            {credits.cast && credits.cast.length > 0 && (
              <div>
                <h3 className='text-sm font-bold text-yellow-500'>Cast</h3>
                <ul className='mb-4 space-y-1'>
                  {credits.cast.map((actor, index) => (
                    <Link
                      to={`/person/${actor.id}`}
                      key={index}
                      className='text-sm block text-white'
                    >
                      {actor.name} as{' '}
                      <span className='italic'>{actor.character}</span>
                    </Link>
                  ))}
                </ul>
              </div>
            )}
            {credits.crew && credits.crew.length > 0 && (
              <div>
                <h3 className='text-sm font-bold text-yellow-500'>Crew</h3>
                <ul className='mb-4'>
                  {credits.crew.map((member, index) => (
                    <Link
                      to={`/person/${member.id}`}
                      key={index}
                      className='text-sm block text-white'
                    >
                      {member.name} ({member.job})
                    </Link>
                  ))}
                </ul>
              </div>
            )}
            {credits.guest_stars && credits.guest_stars.length > 0 && (
              <div>
                <h3 className='text-sm font-bold text-yellow-500'>
                  Guest Stars
                </h3>
                <ul className='mb-4 space-y-1'>
                  {credits.guest_stars.map((star, index) => (
                    <Link
                      to={`/person/${star.id}`}
                      key={index}
                      className='text-sm block text-white'
                    >
                      {star.name} as{' '}
                      <span className='italic'>{star.character}</span>
                    </Link>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default Dropdown
