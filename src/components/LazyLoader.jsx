import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Loading from "./Loading";


const LazyLoader = ({ src, alt, placeholderSrc, ...props }) => {
  const [loaded, setLoaded] = useState(false);

  return (
    <>
      {/* Placeholder shown until the image is loaded */}
      {!loaded && (
        <Loading isSmall={true}/>
      )}

      {/* Actual image with lazy loading */}
      <img
        src={src}
        alt={alt}
        onLoad={() => setLoaded(true)}
        style={{ display: loaded ? 'block' : 'none' }} // Hide actual image until loaded
        {...props}
      />
    </>
  );
};

export default LazyLoader;
