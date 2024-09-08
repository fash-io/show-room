import { useState, useEffect } from "react";

const SlidingImages = ({ images }) => {
  const [isHovered, setIsHovered] = useState(false);
  console.log(images);

  useEffect(() => {
    const slider = document.querySelector(".slider");
    if (isHovered) {
      slider.style.animationPlayState = "paused";
    } else {
      slider.style.animationPlayState = "running";
    }
  }, [isHovered]);

  return (
    <div className={`slider-wrapper bg-white/50 px-3 rounded-lg`}>
      <div className={`slider h-full flex items-center`}>
        {images.map((image, index) => (
          <>
            {image.file_path ||
              (image.logo_path && (
                <div key={index} className="slider-item h-full flex items-center mx-5 scale-90">
                  <img
                    src={`https://image.tmdb.org/t/p/original${
                      image.file_path || image.logo_path
                    }`}
                    alt={image.name}
                    className="min-w-0 "
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                  />
                </div>
              ))}
          </>
        ))}
      </div>
    </div>
  );
};

export default SlidingImages;
