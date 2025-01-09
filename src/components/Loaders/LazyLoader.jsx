import { useState } from 'react'
import Loading from './Loading'
import Loader_ from './Loader_'

const LazyLoader = ({ src, alt, className, ...props }) => {
  const [loaded, setLoaded] = useState(false)

  return (
    <>
      {!loaded && (
        <div
          className='absolute top-0 bottom-0 -z-10 left-0 right-0 bg-[rgba(20,20,20,0.9)] animate-pulse  rounded-lg flex justify-center items-center'
          style={{ animationDuration: '1.4s' }}
        ></div>
      )}
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
