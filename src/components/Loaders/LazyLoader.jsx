import { useState } from 'react'
import Loading from './Loading'

const LazyLoader = ({ src, alt, className, ...props }) => {
  const [loaded, setLoaded] = useState(false)

  return (
    <>
      {!loaded && <Loading isSmall={true} />}
      <img
        src={src}
        alt={alt}
        onLoad={() => setLoaded(true)}
        className={className}
        style={{ display: loaded ? 'block' : 'none' }}
        {...props}
      />
    </>
  )
}
export default LazyLoader
