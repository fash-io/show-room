/* eslint-disable react/prop-types */
import { Link } from 'react-router-dom'

const Error = ({
  error = 'An unexpected error occurred.',
  href,
  isSmall,
  goHome
}) => {
  return (
    <div
      className={`body  text-white flex items-center justify-center ${
        isSmall
          ? 'z-10 h-full w-full'
          : 'fixed top-0 bottom-0 left-0 right-0 h-screen z-50'
      }`}
    >
      <div className='bg-gray-800/40 p-8 rounded-xl shadow-lg text-center space-y-5'>
        <Link
          className='text-lg sm:text:xl font-semibold block'
          to={href ? href : ''}
        >
          {error}
        </Link>

        {goHome ? (
          <Link
            to={'/'}
            className='inline-block bg-slate-950 px-3 py-2 rounded-md hover:bg-slate-900 duration-200'
          >
            Go to the homepage
          </Link>
        ) : (
          <button
            onClick={() => window.location.replace('/')} // Or trigger your fetch logic
            className='text-sm px-2 py-1 bg-blue-600 rounded hover:bg-blue-500 transition duration-200'
          >
            Try Again
          </button>
        )}
      </div>
    </div>
  )
}

export default Error
