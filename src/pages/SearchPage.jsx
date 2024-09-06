import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";
import Loading from "../components/Loading";
import GoBackButton from "../components/GoBackButton";

const SearchPage = (props) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [filter, setFilter] = useState("multi");
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [error, setError] = useState(null); // For error handling

  const { options } = props;

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
    setPage(1);
  };

  const handleChange = (e) => {
    setQuery(e.target.value);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= (totalPages || 1)) {
      setPage(newPage);
      searchMovies(newPage);
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  };

  // Function to handle the search
  const searchMovies = async (page = 1) => {
    if (query.trim() === "") return;

    setLoading(true);
    setError(null); // Reset error

    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/search/${filter}?query=${encodeURIComponent(
          query
        )}&include_adult=false&language=en-US&page=${page}`,
        options
      );
      if (!response.ok) throw new Error("Network response was not ok");

      const data = await response.json();

      if (data.results) {
        setResults(data.results);
        setTotalPages(data.total_pages);
      } else {
        setResults([]);
        setTotalPages(1);
      }
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Something went wrong. Please try again.");
      setResults([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  // Trigger search when filter or page changes
  useEffect(() => {
    if (query.trim() !== "") {
      searchMovies(page);
    }
  }, [filter, page]); // Re-run searchMovies when filter or page changes

  const handleSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    setResults([]); // Clear previous results
    searchMovies(1); // Call search for page 1
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <>
      <Navbar />
      <GoBackButton />

      <div className="min-h-screen pt-20 text-white">
        <header className="mb-6 px-20">
          <form onSubmit={handleSubmit} className="mt-4 sm:flex items-center">
            <input
              type="text"
              value={query}
              onChange={handleChange}
              placeholder="Search ..."
              className="w-full p-2 border border-gray-700 rounded-md bg-gray-950 placeholder-gray-400"
              aria-label="Search"
            />
            <div className="sm:flex justify-between mt-3 sm:mt-0 ">
              <button
                type="submit"
                className="sm:ml-2 px-4 py-2 bg-blue-900 hover:bg-blue-950 duration-200 rounded-md w-full sm:w-auto sm:m-0 my-1"
                aria-label="Search"
              >
                Search
              </button>
              {results.length > 0 && (
                <select
                  value={filter}
                  onChange={handleFilterChange}
                  className="sm:ml-2 px-4 py-2 bg-blue-900 hover:bg-blue-950 duration-200 rounded-md w-full sm:w-auto"
                  aria-label="Select search type"
                >
                  <option value="multi">Filter Search</option>
                  <option value="movie">Movies</option>
                  <option value="person">Person</option>
                  <option value="tv">Series</option>
                </select>
              )}
            </div>
          </form>
        </header>

        {error && <div className="text-red-500 text-center">{error}</div>}

        <main className="sm:p-10 p-6">
          {results.length === 0 ? (
            <p className="text-center text-gray-500">No results found.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {results.map((data) => (
                <Link
                  key={data.id}
                  to={`/${
                    data.media_type === "movie"
                      ? "movie"
                      : data.media_type === "tv"
                      ? "series"
                      : data.media_type === "person"
                      ? "person"
                      : filter === "tv"
                      ? "series"
                      : filter
                  }/${data.id}`}
                  className="flex flex-col items-center bg-gray-80 rounded-lg overflow-hidden shadow-lg sm:transform sm:hover:scale-105 sm:transition-transform sm:duration-300"
                >
                  <img
                    src={
                      data.backdrop_path ||
                      data.poster_path ||
                      data.profile_path
                        ? `https://image.tmdb.org/t/p/w500${
                            data.backdrop_path ||
                            data.poster_path ||
                            data.profile_path
                          }`
                        : "https://via.placeholder.com/150x225?text=No+Image"
                    }
                    alt={data.name || data.title}
                    className={`${!(data.backdrop_path) ? filter === "person" ? "object-cover" : "max-h-44" :"w-full"}`}
                  />
                  <div className="p-4 w-full">
                    <h3 className="text-2xl font-semibold text-white mb-3">
                      {data.name || data.title}
                    </h3>
                    <p className="text-gray-400">
                      {data.media_type === "person"
                        ? data.known_for_department
                        : data.release_date || data.first_air_date}
                    </p>
                    <p className="text-gray-200 text-sm mb-4">
                      {data.overview ? (
                        data.overview.length > 100 ? (
                          `${data.overview.slice(0, 100)}...`
                        ) : (
                          data.overview
                        )
                      ) : data.known_for ? (
                        <div>
                          Known for:{" "}
                          {data.known_for.map((show) => {
                            return (
                              <Link
                                key={show.id}
                                to={`/${
                                  show.media_type === "movie"
                                    ? "movie"
                                    : "series"
                                }/${show.id}`}
                              >
                                <li className="text-base sm:text-xs hover:underline underline-offset-2 duration-75 text-blue-300 hover:text-blue-500">
                                  {show.name || show.title}
                                </li>
                              </Link>
                            );
                          })}
                        </div>
                      ) : (
                        ""
                      )}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </main>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="mt-8 flex justify-center items-center space-x-4">
            <button
              onClick={() => handlePageChange(page - 1)}
              disabled={page === 1 || loading}
              className={`py-2 px-4 rounded ${
                page === 1 || loading
                  ? "bg-gray-800 text-gray-500 cursor-not-allowed"
                  : "bg-gray-900 text-white hover:bg-slate-900"
              }`}
              aria-label="Previous page"
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
                  ? "bg-gray-800 text-gray-500 cursor-not-allowed"
                  : "bg-gray-900 text-white hover:bg-slate-900"
              }`}
              aria-label="Next page"
            >
              Next
            </button>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default SearchPage;
