import { useState, useEffect, useRef } from "react";
import { useSwipeable } from "react-swipeable";
import play_icon from "../assets/play_icon.png";
import info_icon from "../assets/info_icon.png";
import { Link } from "react-router-dom";
import Loading from "./Loading";

const Slider = (props) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const sliderRef = useRef();
  const intervalRef = useRef();
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  // eslint-disable-next-line react/prop-types
  const { height, type, options } = props;

  useEffect(() => {
    const fetchNewReleases = async () => {
      try {
        const response = await fetch(
          `https://api.themoviedb.org/3/trending/${type}/day?language=en-US`,
          options
        );
        const data = await response.json();
        setMovies(data.results);
      } catch (err) {
        setError("Failed to load new releases.", err);
      } finally {
        setLoading(false);
      }
    };

    fetchNewReleases();
  }, [options, type]);

  useEffect(() => {
    if (movies.length > 0) {
      startAutoSlide();
      return () => clearInterval(intervalRef.current);
    }
  }, [movies]);

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
      prevIndex === 0 ? movies.length - 1 : prevIndex - 1
    );
    resetAutoSlide();
  };

  const goToNextSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === movies.length - 1 ? 0 : prevIndex + 1
    );
    resetAutoSlide();
  };

  useEffect(() => {
    if (currentIndex === 0 && sliderRef.current) {
      sliderRef.current.style.transition = "transform 1s ease-in-out";
    }
  }, [currentIndex]);

  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => goToNextSlide(),
    onSwipedRight: () => goToPreviousSlide(),
    trackMouse: true,
  });
  if (!movies) {
    return <Loading />;
  }

  return (
    <div className={`relative overflow-hidden z-40 ${height}`}>
      {/* Left button for manual navigation */}
      <button
        onClick={goToPreviousSlide}
        className="hidden sm:block absolute left-2 md:left-10 top-1/2 transform -translate-y-1/2 text-white bg-black/50 p-2 md:p-3 rounded-full z-10 hover:bg-black/70 transition duration-200"
      >
        ❮
      </button>

      {/* Slider container */}
      <div
        ref={sliderRef}
        {...swipeHandlers}
        className="flex transition-transform duration-1000 ease-in-out"
        style={{
          transform: `translateX(-${currentIndex * 100}%)`,
        }}
      >
        {movies.map((movie, index) => (
          <div key={index} className="min-w-full relative h-full">
            <img
              src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
              alt={movie.title || movie.name}
              className={`w-full object-cover ${height}`}
            />
            <div className="absolute w-full px-4 sm:px-6 md:px-[6%] bottom-0 text-white bg-gradient-to-t from-black via-transparent to-transparent pb-4 sm:pb-6">
              <h1 className="text-2xl sm:text-3xl md:text-5xl mb-4 md:mb-10 font-bold">
                {movie.title || movie.name}
              </h1>

              <p className="max-w-xs sm:max-w-sm md:max-w-md lg:max-w-xl text-xs sm:text-sm md:text-lg mb-2 sm:mb-4 hidden sm:block">
                {movie.overview}
              </p>
              <p className="text-xs sm:text-sm md:text-md mb-2 uppercase tracking-wider text-slate-400 font-bold">
                {movie.media_type === "movie" ? "Movie" : "TV Show"}
              </p>
              <div className="flex gap-2 sm:gap-3 mb-4 sm:mb-8 md:mb-12">
                <Link
                  to={`/${movie.media_type === "movie" ? "movie" : "series"}/${
                    movie.id
                  }`}
                  className="py-1 sm:py-2 flex px-3 sm:px-4 md:px-5 items-center gap-1 sm:gap-2 md:gap-3 text-xs sm:text-sm font-semibold bg-[#6d6d6eb3] rounded cursor-pointer hover:bg-[#6d6d6e66] transition duration-200"
                >
                  <img src={info_icon} width={20} alt="Info Icon" />
                  More Info
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Right button for manual navigation */}
      <button
        onClick={goToNextSlide}
        className="hidden sm:block absolute right-2 md:right-10 top-1/2 transform -translate-y-1/2 text-white bg-black/50 p-2 md:p-3 rounded-full z-10 hover:bg-black/70 transition duration-200"
      >
        ❯
      </button>
    </div>
  );
};

export default Slider;
