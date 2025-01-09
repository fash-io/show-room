import Loader from './Loader'

/* eslint-disable react/prop-types */
const Loading = ({ isSmall, transparent }) => {
  if (!transparent) {
    return (
      <div
        className={`bg-gradient-to-r from-gray-800 via-gray-900 to-black  text-white flex items-center justify-center z-[999] ${
          isSmall
            ? 'z-10 h-full w-full'
            : 'fixed top-0 bottom-0 left-0 right-0  z-50'
        }`}
      >
        {/* <p className='text-xl font-semibold'>Loading</p>
          <p className={`spans ${isSmall ? 'text-lg' : 'text-2xl'}`}>
            <span>.</span>
            <span>.</span>
            <span>.</span>
          </p> */}
        <Loader />
      </div>
    )
  } else {
    return (
      <div className='fixed min-h-screen w-full bg-black/70 flex justify-center items-center z-10'>
        <p className='text-xl font-semibold'>Loading</p>
        <p className={`spans`}>
          <span>.</span>
          <span>.</span>
          <span>.</span>
        </p>
      </div>
    )
  }
}

export default Loading
