import { BiExpand } from 'react-icons/bi'
import UserContext from '../../UserContext'
import { useContext } from 'react'

const VideoPlayer = ({ trailerUrl }) => {
  const { setTrailerUrl } = useContext(UserContext)

  return (
    <div className='absolute top-0 left-0 w-full h-full z-10 '>
      <iframe
        src={`https://www.youtube.com/embed/${trailerUrl}?autoplay=1&controls=0`}
        className='w-full h-full pointer-events-none'
        frameBorder='0'
        allow='autoplay; encrypted-media'
        allowFullScreen
      />
      <span className='absolute p-2 top-0 hover:bg-slate-400'>
        <BiExpand
          size={25}
          onClick={e => {
            e.preventDefault()
            setTrailerUrl(trailerUrl)
          }}
        />
      </span>
    </div>
  )
}

export default VideoPlayer
