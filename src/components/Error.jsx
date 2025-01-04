import { Link } from 'react-router-dom'

const Error = ({
  error = 'An unexpected error occurred. Please try again later.',
  href,
  isSmall,
  goHome
}) => {
  return (
    <div
      className={`bg-gradient-to-r  from-gray-800 via-gray-900 to-black  text-white flex items-center justify-center ${
        isSmall
          ? 'z-10 h-full w-full'
          : 'fixed top-0 bottom-0 left-0 right-0 h-screen z-50'
      }`}
    >
      <div className='bg-gray-800 p-8 rounded-lg shadow-lg text-center space-y-5'>
        <Link
          className='text-lg sm:text:xl font-semibold block'
          to={href ? href : ''}
        >
          {error}
        </Link>
        {goHome && (
          <Link
            to={'/'}
            className='inline-block bg-slate-950 px-3 py-2 rounded-md hover:bg-slate-900 duration-200'
          >
            Go to the homepage
          </Link>
        )}
      </div>
    </div>
  )
}

export default Error
