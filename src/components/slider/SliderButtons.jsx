import { useEffect } from 'react'
import { BiLeftArrowCircle, BiRightArrowCircle } from 'react-icons/bi'

const SliderButtons = ({ onClick, direction }) => {
  useEffect(() => {
    const handleKeyDown = event => {
      if (event.key === 'ArrowLeft') {
        goToPreviousSlide()
      } else if (event.key === 'ArrowRight') {
        goToNextSlide()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [])
  return (
    <div
      onClick={onClick}
      className={`hidden sm:flex justify-center items-center w-32 absolute h-full z-10 cursor-pointer text-white hover:bg-black/20 duration-200 group ${
        direction === 'right' && 'right-0 top-0'
      }`}
      title={direction === 'right' ? 'Next slide' : 'Previous slide'}
    >
      <button
        aria-label={direction === 'right' ? 'Next slide' : 'Previous slide'}
        className={`md:left-10 left-2 p-2 md:p-3 rounded-full group-hover:scale-150 transition duration-200`}
        style={{ textShadow: '0px 2px 2px rgba(0, 0, 0, 0.9)' }}
      >
        {direction === 'right' ? <BiRightArrowCircle /> : <BiLeftArrowCircle />}
      </button>
    </div>
  )
}
export default SliderButtons
