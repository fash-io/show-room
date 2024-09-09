import { useState, useEffect } from "react";

const SlidingImages = ({ images }) => {
  const [isHovered, setIsHovered] = useState(false);
  useEffect(() => {
    const slider = document.querySelector(".slider");
    if (isHovered) {
      slider.style.animationPlayState = "paused";
    } else {
      slider.style.animationPlayState = "running";
    }
  }, [isHovered]);

  return (
    <div className={`relative w-full overflow-hidden bg-white/50 px-3 rounded-lg`}>
      <div className={`slider gap-3 w-max duration-1000 h-full flex items-center`}>
        {images.map((image, index) => (
          <>
            {image.file_path ||
              (image.logo_path && (
                <div key={`${index} + ${image.file_path || image.logo_path}`} className="slider-item h-full flex items-center mx-5 scale-90">
                  <img
                    src={`https://image.tmdb.org/t/p/original${
                      image.file_path || image.logo_path
                    }`}
                    alt={image.name}
                    className="w-[130px] h-auto rounded-xl "
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
