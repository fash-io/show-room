/* eslint-disable react/prop-types */
import Lottie from 'react-lottie'
import animationData from '../../assets/animation data/Animation - 1736161602266.json'

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
        <div
          className={` rounded-lg text-center ${
            isSmall ? 'p-4 ' : 'bg-black p-8 shadow-lg rounded-full'
          }`}
        >
          {/* <Lottie options={{ loop: true, autoplay: true, animationData }} /> */}
          <p className='text-xl font-semibold'>Loading</p>
          <p className={`spans ${isSmall ? 'text-lg' : 'text-2xl'}`}>
            <span>.</span>
            <span>.</span>
            <span>.</span>
          </p>
        </div>
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
