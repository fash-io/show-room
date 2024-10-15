import { useState, useEffect, useRef } from "react";
import { useSwipeable } from "react-swipeable";
import { Link } from "react-router-dom";
import info_icon from "../assets/info_icon.png";
import { options } from "../utils/api";
import Loading from "./Loading";

const Slider = (props) => {
  const { height, type, setError, setLoading } = props;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [show, setShow] = useState([]);
  const sliderRef = useRef();
  const intervalRef = useRef();

  useEffect(() => {
    const fetchNewReleases = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `https://api.themoviedb.org/3/trending/${type}/day`,
          options
        );
        const data = await response.json();
        setShow(data.results || []);
      } catch (err) {
        setError("Failed to load new releases.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchNewReleases();
  }, [type, setError, setLoading]);

  useEffect(() => {
    if (show.length > 0) {
      startAutoSlide();
      return () => clearInterval(intervalRef.current);
    }
  }, [show]);

  const startAutoSlide = () => {
    intervalRef.current = setInterval(() => {
      goToNextSlide();
    }, 5000);
  };

  const resetAutoSlide = () => {
    clearInterval(intervalRef.current);
    startAutoSlide();
  };

  const goToPreviousSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? show.length - 1 : prevIndex - 1
    );
    resetAutoSlide();
  };

  const goToNextSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === show.length - 1 ? 0 : prevIndex + 1
    );
    resetAutoSlide();
  };

  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => goToNextSlide(),
    onSwipedRight: () => goToPreviousSlide(),
    trackMouse: true,
  });

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "ArrowLeft") {
        goToPreviousSlide();
      } else if (event.key === "ArrowRight") {
        goToNextSlide();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <div className={`relative overflow-hidden z-40 ${height}`}>
      <div
        onClick={goToPreviousSlide}
        className="hidden sm:flex justify-center items-center w-32 absolute h-full z-10 cursor-pointer text-white hover:bg-black/20 duration-200 group"
        title="Previous slide"
      >
        <button
          aria-label="Previous slide"
          className="md:left-10 left-2 p-2 md:p-3 rounded-full group-hover:scale-150 transition duration-200"
          style={{ textShadow: "0px 2px 2px rgba(0, 0, 0, 0.9)" }}
        >
          ❮
        </button>
      </div>

      <div
        ref={sliderRef}
        {...swipeHandlers}
        className="flex transition-transform duration-1000 ease-in-out"
        style={{
          transform: `translateX(-${currentIndex * 100}%)`,
        }}
      >
        {show.length > 0 ? (
          show.map((movie, index) => (
            <div key={index} className="min-w-full relative h-full">
              <img
                src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
                alt={movie.title || movie.name}
                className={`w-full object-cover object-top ${height}`}
              />
              <div className="absolute w-full px-4 sm:px-6 md:px-[9%] bottom-0 text-white bg-gradient-to-t from-black via-transparent to-transparent pb-4 sm:pb-6">
                <h1
                  className="text-lg sm:text-3xl md:text-4xl mb-4 md:mb-10 font-bold"
                  style={{ textShadow: "2px 2px 4px #000000" }}
                >
                  {movie.title || movie.name}
                </h1>
                <p
                  className="max-w-xs sm:max-w-sm md:max-w-md lg:max-w-xl text-xs sm:text-xs lg:text-lg leading-5 mb-2 sm:mb-4 hidden md:block"
                  style={{ textShadow: "2px 2px 4px #000000" }}
                >
                  {movie.overview.length > 300
                    ? `${movie.overview.slice(0, 300)}...`
                    : movie.overview}
                </p>
                <p
                  className="text-xs sm:text-sm md:text-md mb-2 uppercase tracking-wider text-slate-400 font-bold"
                  style={{ textShadow: "2px 2px 4px #000000" }}
                >
                  {movie.media_type === "movie" ? "Movie" : "TV Show"}
                </p>
                <div className="flex gap-2 sm:gap-3 mb-4 sm:mb-8 md:mb-12">
                  <Link
                    to={`/${
                      movie.media_type === "movie" ? "movie" : "series"
                    }/${movie.id}`}
                    className="py-1 sm:py-2 flex px-3 sm:px-4 md:px-5 items-center gap-1 sm:gap-2 md:gap-3 text-xs sm:text-sm font-semibold bg-[#6d6d6eb3] rounded cursor-pointer hover:bg-[#6d6d6e66] transition duration-200"
                  >
                    <img src={info_icon} width={20} alt="Info Icon" />
                    More Info
                  </Link>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="w-full h-full flex justify-center items-center text-white">
            <Loading isSmall={true}/>
          </div>
        )}
      </div>

      <div
        onClick={goToNextSlide}
        className="hidden sm:flex justify-center items-center w-32 absolute right-0 top-0 h-full z-10 cursor-pointer text-white hover:bg-black/20 duration-500 group"
        title="Next slide"
      >
        <button
          aria-label="Next slide"
          className="md:left-10 left-2 p-2 md:p-3 rounded-full group-hover:scale-150 transition duration-200"
          style={{ textShadow: "0px 2px 2px rgba(0, 0, 0, 0.9)" }}
        >
          ❯
        </button>
      </div>
    </div>
  );
};

export default Slider;
