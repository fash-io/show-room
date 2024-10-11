import { useEffect, useState } from "react";
import Error from "../components/Error";
import Pagination from "../components/Pagination";
import { options } from "../utils/api";
import ShowCard from "../components/ShowCard";

const PopularPage = (props) => {
  const { setLoading } = props;

  const [mediaType, setMediaType] = useState("all");
  const [timeWindow, setTimeWindow] = useState("day");
  const [page, setPage] = useState(1);
  const [popularMovies, setPopularMovies] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [error, setError] = useState(null);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  useEffect(() => {
    const fetchNewReleases = async () => {
      try {
        const url = `https://api.themoviedb.org/3/trending/${mediaType}/${timeWindow}?language=en-US&page=${page}`;
        const response = await fetch(url, options);
        if (!response.ok) {
          throw new Error("Failed to fetch new releases.");
        }
        const data = await response.json();
        setPopularMovies(data.results);
        setTotalPages(data.total_pages);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchNewReleases();
  }, [mediaType, timeWindow, page]);

  useEffect(() => {
    setPage(1);
  }, [mediaType, timeWindow]);

  if (error) {
    return <Error error={error} />; // Error component
  }

  return (
    <div className="min-h-screen text-white py-20 px-4 sm:px-8 lg:px-8">
      {/* Filter and Time Window Controls */}
      <div className="flex flex-col lg:flex-row items-center justify-between mb-10 space-y-4 lg:space-y-0 sm:px-20">
        {/* Media Type Selector */}
        <div className="flex flex-wrap items-center space-x-4">
          {["all", "movie", "tv"].map((type) => (
            <button
              key={type}
              onClick={() => setMediaType(type)}
              className={`px-4 py-2 rounded-full ${
                mediaType === type
                  ? `${
                      type === "all"
                        ? "bg-blue-500"
                        : type === "movie"
                        ? "bg-green-500"
                        : "bg-purple-500"
                    } text-white`
                  : "bg-gray-700 text-gray-300"
              } hover:bg-${
                type === "all" ? "blue" : type === "movie" ? "green" : "purple"
              }-600 transition-colors`}
            >
              {type === "all"
                ? "All"
                : type === "movie"
                ? "Movies"
                : "TV Shows"}
            </button>
          ))}
        </div>

        {/* Time Window Selector */}
        <div className="flex flex-wrap items-center space-x-4">
          {["day", "week"].map((window) => (
            <button
              key={window}
              onClick={() => setTimeWindow(window)}
              className={`px-4 py-2 rounded-full ${
                timeWindow === window
                  ? `${
                      window === "day" ? "bg-red-500" : "bg-orange-500"
                    } text-white`
                  : "bg-gray-700 text-gray-300"
              } hover:bg-${
                window === "day" ? "red" : "orange"
              }-600 transition-colors`}
            >
              {window === "day" ? "Daily" : "Weekly"}
            </button>
          ))}
        </div>
      </div>

      {/* Movies Grid */}
      <div className="sm:px-14 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-5 gap-5 sm:gap-y-8">
        {popularMovies
          .filter((movie) => movie.poster_path) // Filter movies that have a poster_path
          .map((movie) => (
            <ShowCard
              key={movie.id}
              show={movie}
              type={3}
              mediaType={mediaType}
            />
          ))}
      </div>

      <Pagination
        totalPages={totalPages}
        page={page}
        handlePageChange={handlePageChange}
      />
    </div>
  );
};

export default PopularPage;
