import React, { useEffect, useState } from 'react'

const YouTubePlayer = ({ videoId, onRemove }) => {
  const [player, setPlayer] = useState(null)
  const [duration, setDuration] = useState(0)

  useEffect(() => {
    const onPlayerReady = event => {
      setPlayer(event.target)
      setDuration(event.target.getDuration())
    }

    const onPlayerStateChange = event => {
      if (event.data === 1) {
        const remainingTime = (duration - 2) * 1000
        const timer = setTimeout(() => {
          onRemove()
        }, remainingTime)

        return () => clearTimeout(timer)
      }
    }

    const playerInstance = new window.YT.Player(`youtube-player-${videoId}`, {
      videoId,
      events: {
        onReady: onPlayerReady,
        onStateChange: onPlayerStateChange
      }
    })

    return () => {
      if (playerInstance) {
        playerInstance.destroy() // Clean up player instance
      }
    }
  }, [videoId, duration, onRemove])

  return <div id={`youtube-player-${videoId}`} className='w-full h-full' />
}

export default YouTubePlayer
