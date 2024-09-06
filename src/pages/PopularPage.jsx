import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Loading from "../components/Loading";
import GoBackButton from "../components/GoBackButton";
import Error from "../components/Error";

const PopularPage = ({ options }) => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mediaType, setMediaType] = useState("all"); // 'all', 'movie', 'tv'
  const [timeWindow, setTimeWindow] = useState("day"); // 'day', 'week'
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
      window.scrollTo({
        top: 0,
        behavior: "smooth", // Changed to 'smooth' for a better user experience
      });
    }
  };

  useEffect(() => {
    const fetchNewReleases = async () => {
      try {
        setLoading(true); // Set loading true before fetching data
        const url = `https://api.themoviedb.org/3/trending/${mediaType}/${timeWindow}?language=en-US&page=${page}`;
        const response = await fetch(url, options);
        if (!response.ok) {
          throw new Error("Failed to fetch new releases.");
        }
        const data = await response.json();
        setMovies(data.results);
        setTotalPages(data.total_pages);
      } catch (err) {
        console.error("Failed to fetch new releases:", err);
        setError("Failed to load new releases.");
      } finally {
        setLoading(false); // Ensure loading is set to false after fetching data
      }
    };
    fetchNewReleases();
  }, [options, mediaType, timeWindow, page]); // Added 'page' to dependencies

  useEffect(() => {
    setPage(1);
  }, [mediaType, timeWindow]);

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <Error error={error} />;
  }

  return (
    <>
      <Navbar />
      <GoBackButton />

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
                  type === "all"
                    ? "blue"
                    : type === "movie"
                    ? "green"
                    : "purple"
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
                className={`px-4 py-2 rounded-full  ${
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
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-5 gap-5 sm:gap-y-8">
          {movies.map((movie) => (
            <Link
              key={movie.id}
              to={`/${movie.media_type === "movie" ? "movie" : "series"}/${
                movie.id
              }`}
              className="group bg-gray-800 rounded-lg overflow-hidden shadow-lg transition-transform transform sm:hover:scale-105 sm:hover:shadow-2xl w-full h-72 sm:h-80 lg:h-96"
            >
              <img
                src={
                  movie.poster_path
                    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                    : "https://via.placeholder.com/300x450?text=No+Image"
                }
                alt={movie.title || movie.name}
                className="w-full h-72 sm:h-80 lg:h-96 object-cover rounded-t-lg absolute -z-10"
              />
              <div
                className="p-4  "
                style={{ textShadow: "0px 0px 5px rgba(0, 0, 0, 1)" }}
              >
                {mediaType !== "all" ? (
                  ""
                ) : (
                  <p className="text-gray-100 text-sm float-right">
                    {movie.media_type.toUpperCase()}
                  </p>
                )}
                <p className=" text-gray-100 text-sm absolute bottom-0 left-0 w-full inset-10 bg-gradient-to-t from-[rgba(0,0,0,0.6)] to-transparent flex items-end p-2">
                  {movie.release_date || movie.first_air_date}
                </p>
              </div>
            </Link>
          ))}
        </div>
        {/* Pagination */}
        <div className="mt-8 flex justify-center items-center space-x-4">
          <button
            onClick={() => handlePageChange(page - 1)}
            disabled={page === 1 || loading}
            className={`py-2 px-4 rounded ${
              page === 1 || loading
                ? "bg-gray-700 text-gray-500 cursor-not-allowed"
                : "bg-gray-800 text-white hover:bg-gray-700"
            }`}
          >
            Previous
          </button>
          <span className="text-white">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => handlePageChange(page + 1)}
            disabled={page === totalPages || loading}
            className={`py-2 px-4 rounded ${
              page === totalPages || loading
                ? "bg-gray-700 text-gray-500 cursor-not-allowed"
                : "bg-gray-800 text-white hover:bg-gray-700"
            }`}
          >
            Next
          </button>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default PopularPage;
