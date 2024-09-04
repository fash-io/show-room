import React, { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";
import Loading from "../components/Loading";
import GoBackButton from "../components/GoBackButton";

const SearchPage = (props) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [opt, setOpt] = useState("movie");
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const { options } = props;

  const handleSearch = async () => {
    if (query.trim() === "") return;

    setLoading(true);

    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/search/${opt}?query=${query}&include_adult=false&language=en-US&page=${page}`,
        options
      );
      if (!response.ok) throw new Error("Network response was not ok");
      const data = await response.json();
      console.log("API response:", data);

      if (data.results) {
        setResults(data.results);
        setTotalPages(data.total_pages);
      } else {
        setResults([]);
        setTotalPages(1); // Ensure totalPages is set correctly
      }
    } catch (err) {
      console.error("Fetch error:", err);
      setResults([]);
      setTotalPages(1); // Reset totalPages on error
    } finally {
      setLoading(false);
    }
  };

  const handleOptChange = (e) => {
    setOpt(e.target.value);
    setQuery("");
    setResults([]);
    setPage(1);
    setTotalPages(1);
  };

  const handleChange = (e) => {
    setQuery(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    handleSearch();
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= (totalPages || 1)) {
      setPage(newPage);
      setLoading(true);
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
      handleSearch();
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <>
      <Navbar />
      <GoBackButton />

      <div className="min-h-screen pt-20 text-white p-20">
        <header className="mb-6">
          <form onSubmit={handleSubmit} className="mt-4 sm:flex items-center">
            <input
              type="text"
              value={query}
              onChange={handleChange}
              placeholder={`Search ${opt}...`}
              className="w-full p-2 border border-gray-700 rounded-md bg-gray-950 placeholder-gray-400"
              aria-label={`Search ${opt}`}
            />
            <div className="max-sm:flex justify-between mt-3">
            <button
              type="submit"
              className="sm:ml-2 px-4 py-2 bg-blue-900 hover:bg-blue-950 duration-200 rounded-md order-last sm:order-none"
              aria-label="Search"
            >
              Search
            </button>
            <select
              value={opt}
              onChange={handleOptChange}
              className="sm:ml-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 duration-200 rounded-md"
              aria-label="Select search type"
            >
              <option value="movie">Movies</option>
              <option value="person">Person</option>
              <option value="tv">Series</option>
            </select>
            </div>
          </form>
        </header>
        <main>
          {results.length === 0 ? (
            <p className="text-center text-gray-500">No results found.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {results.map((data) => (
                <Link
                  key={data.id}
                  to={`/${opt === "movie" ? "movie" :opt === "person" ? "person" : "series"}/${data.id}`}
                  className="block bg-gray-800 border border-gray-700 rounded-lg overflow-hidden shadow-lg transform hover:scale-105 transition-transform duration-300"
                >
                  <img
                    src={
                      data.poster_path || data.backdrop_path || data.profile_path
                        ? `https://image.tmdb.org/t/p/w500${
                            data.poster_path || data.backdrop_path || data.profile_path
                          }`
                        : "https://via.placeholder.com/150x225?text=No+Image"
                    }
                    alt={data.name || data.title}
                    className="w-full h-64 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="text-2xl font-semibold text-white mb-3">
                      {data.name || data.title}
                    </h3>
                    <p className="text-gray-400">
                      {opt === "person"
                        ? data.known_for_department
                        : data.release_date || data.first_air_date}
                    </p>
                    <p className="text-gray-200 text-sm mb-4">
                      {data.overview &&
                        (data.overview.length > 100
                          ? `${data.overview.slice(0, 100)}...`
                          : data.overview)}
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
