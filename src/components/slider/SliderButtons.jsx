/* eslint-disable react/prop-types */
import { BiLeftArrowAlt, BiRightArrowAlt } from 'react-icons/bi'

const SliderButtons = ({ onClick, direction }) => {
  return (
    <div
      onClick={onClick}
      className={`hidden sm:flex justify-center items-center w-32 absolute h-full cursor-pointer text-white  duration-200 group ${
        direction === 'right' ? 'right-0 top-0' : 'z-[1]'
      }`}
      title={direction === 'right' ? 'Next slide' : 'Previous slide'}
    >
      <button
        aria-label={direction === 'right' ? 'Next slide' : 'Previous slide'}
        className={`md:left-10 left-2 p-2 md:p-3 rounded-full group-hover:scale-150 transition duration-200`}
        style={{ textShadow: '0px 2px 2px rgba(0, 0, 0, 0.9)' }}
      >
        {direction === 'right' ? <BiRightArrowAlt /> : <BiLeftArrowAlt />}
      </button>
    </div>
  )
}
export default SliderButtons
