import React from 'react'

const VideoPlayer = ({ trailerUrl }) => {
  return (
    <iframe
      src={`https://www.youtube.com/embed/${trailerUrl}?autoplay=1&controls=0`}
      className='absolute top-0 left-0 w-full h-full z-10 pointer-events-none'
      frameBorder='0'
      allow='autoplay; encrypted-media'
      allowFullScreen
    />
  )
}

export default VideoPlayer
