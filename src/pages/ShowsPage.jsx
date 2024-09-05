import { useState, useEffect, useCallback } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";
import Loading from "../components/Loading";
import GoBackButton from "../components/GoBackButton";
import Slider from "../components/Slider";
import useDebounce from "../utils/useDebounce";
import LazyLoader from "../components/LazyLoader";
import { movieGenre, tvGenre } from "../constants";

const TVShowsPage = ({ options, type_ }) => {
  const [shows, setShows] = useState([]);
  const [filteredShows, setFilteredShows] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sort, setSort] = useState("popularity");
  const [year, setYear] = useState("");
  const [genre, setGenre] = useState("");
  const [error, setError] = useState(null);
  const debouncedYear = useDebounce(year, 1000);
  const [loading, setLoading] = useState(true);
  const genre_ = type_ === "movie" ? movieGenre : tvGenre;

  const fetchShows = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const yearParam = debouncedYear
        ? type_ === "movie"
          ? `primary_release_year=${debouncedYear}`
          : `first_air_date_year=${debouncedYear}`
        : "";
      const response = await fetch(
        `https://api.themoviedb.org/3/discover/${type_}?include_adult=false&include_video=false&language=en-US&page=${page}&sort_by=${sort}.desc&${yearParam}&vote_count.gte=${
          sort === "popularity" ? 800 : sort === "vote_average" ? 1700 : 0
        }&with_genres=${genre}`,
        options
      );

      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }

      const data = await response.json();
      setShows(data.results);
      console.log("API response:", data);
      setFilteredShows(data.results);
      setTotalPages(data.total_pages);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Failed to load shows. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, [page, options, type_, sort, debouncedYear, genre]);

  useEffect(() => {
    fetchShows();
  }, [fetchShows]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
      setLoading(true);
      window.scrollTo({
        top: 0,
        behavior: "instant",
      });
    }
  };

  const handleSortChange = (event) => {
    const newSort = event.target.value;
    setSort(newSort);
  };
  const handleGenreChange = (event) => {
    const newGenre = event.target.value;
    setGenre(newGenre);
  };

  const handleYearChange = (event) => {
    setYear(event.target.value);
  };

  return (
    <>
      <Navbar />
      <div>
        <Slider
          height="min-h-[50vh] sm:max-h-[70vh]  md:max-h-[80vh] lg:max-h-[90vh]"
          movies={filteredShows}
          setLoading={setLoading}
          loading={loading}
          options={options}
          type={type_}
        />
        <GoBackButton />
      </div>

      <div className="container lg:mt-20 mx-auto px-4 sm:px-6 lg:px-8 pt-20 text-white">
        {loading ? (
          <Loading />
        ) : error ? (
          <div className="text-center text-red-500 mb-4">{error}</div>
        ) : filteredShows.length === 0 ? (
          <div className="text-center text-white mb-4">
            No shows found. Try adjusting your filters.
          </div>
        ) : (
          <>
            {/* Filters Section */}
            <div className=" p-4 sm:p-6 rounded-lg mb-8 flex flex-col sm:flex-row sm:justify-between items-start sm:items-center space-y-4 sm:space-y-0 ring-1">
              <div className="flex flex-col sm:flex-row sm:space-x-6 w-full ml-auto justify-end">
                <div className="flex flex-col  mb-4 sm:mb-0">
                  <label htmlFor="sort" className="text-white text-sm mb-2">
                    Sort By:
                  </label>
                  <div className="relative flex">
                    <select
                      id="sort"
                      value={sort}
                      onChange={handleSortChange}
                      className="p-2 rounded-lg bg-gray-900 text-white border border-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-900 w-full sm:w-auto"
                    >
                      <option value="popularity">Popularity</option>
                      <option value="vote_average">Rating</option>
                      <option value="first_air_date">Release Date</option>
                    </select>
                  </div>
                </div>
                <div className="flex flex-col mb-4 sm:mb-0">
                  <label htmlFor="genre" className="text-white text-sm mb-2">
                    Genre
                  </label>
                  <div className="">
                    <select
                      id="genre"
                      value={genre}
                      onChange={handleGenreChange}
                      className="p-2 rounded-lg bg-gray-900 text-white border border-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-900 w-full sm:w-auto"
                    >
                      <option value={""}>Select Genre</option>
                      {genre_.map((genre) => (
                        <option key={genre.id} value={genre.id}>
                          {genre.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="flex flex-col">
                  <label htmlFor="year" className="text-white text-sm mb-2">
                    Year:
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      id="year"
                      value={year}
                      onChange={handleYearChange}
                      placeholder="Enter Year"
                      className="p-2 rounded-lg bg-gray-900 text-white border border-gray-800 w-full focus:outline-none focus:ring-2 focus:ring-blue-900"
                    />
                    <div className="absolute top-0 right-0 flex flex-col h-full text-[8px]">
                      <button
                        type="button"
                        onClick={() =>
                          setYear((prev) => (prev ? Number(prev) + 1 : 1))
                        }
                        className="p-1 px-2 bg-gray-900 text-white rounded-t hover:bg-gray-800"
                      >
                        ▲
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          setYear((prev) => (prev ? Number(prev) - 1 : 0))
                        }
                        className="p-1 px-2 bg-gray-900 text-white rounded-b hover:bg-gray-800"
                      >
                        ▼
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content Area */}
            <div>
              <h2 className="text-center text-3xl sm:text-4xl font-bold text-slate-300 mb-10">
                {type_ === "movie" ? "Movies" : "Series"}
              </h2>
              <div className="grid grid-cols-1   sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8">
                {filteredShows.map((show) => (
                  <Link
                    key={show.id}
                    to={`/${type_ === "movie" ? "movie" : "series"}/${show.id}`}
                    className="block bg-gray-800 rounded-lg overflow-hidden transform sm:hover:scale-105 sm:transition-transform sm:duration-300 h-auto"
                  >
                    <LazyLoader
                      src={
                        show.backdrop_path
                          ? `https://image.tmdb.org/t/p/w500${show.backdrop_path}`
                          : "https://via.placeholder.com/150x140?text=No+Image"
                      }
                      alt={show.name || show.title}
                      className={"w-full  object-cover"}
                    />
                    <div className="p-4">
                      <h3 className="text-lg sm:text-xl font-semibold text-white mb-3">
                        {show.name || show.title}
                      </h3>
                      <p className="text-gray-400 text-sm mb-4">
                        {show.overview.length > 100
                          ? `${show.overview.slice(0, 100)}...`
                          : show.overview}
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
          </>
        )}
      </div>
      <Footer />
    </>
  );
};

export default TVShowsPage;
