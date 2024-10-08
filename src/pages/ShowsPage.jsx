import { useState, useEffect, useCallback, useRef } from "react";
import Slider from "../components/Slider";
import useDebounce from "../utils/useDebounce";
import { movieGenre, tvGenre } from "../constants";
import ShowCard from "../components/ShowCard";
import Pagination from "../components/Pagination";
import { options } from "../utils/api";
import { useLocation } from "react-router-dom";
import { useWindowWidth } from "../utils/windowWidth";
import Loading from "../components/Loading";

const TVShowsPage = () => {
  const { pathname } = useLocation();
  const [shows, setShows] = useState([]);
  const [filteredShows, setFilteredShows] = useState([]);
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState("popularity");
  const [year, setYear] = useState("");
  const [genre, setGenre] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const debouncedYear = useDebounce(year, 1000);
  const type_ = pathname === "/series" ? "tv" : "movie";
  const genre_ = type_ === "movie" ? movieGenre : tvGenre;
  const showsRef = useRef();
  const windowWidth = useWindowWidth();
  const type = windowWidth < 768 ? 3 : 1;

  const fetchShows = useCallback(async () => {
    try {
      setLoading(true);
      const yearParam = debouncedYear
        ? type_ === "movie"
          ? `primary_release_year=${debouncedYear}`
          : `first_air_date_year=${debouncedYear}`
        : "";
      const response = await fetch(
        `https://api.themoviedb.org/3/discover/${type_}?include_adult=false&include_video=false&language=en-US&page=${page}&sort_by=${sort}.desc&${yearParam}&vote_count.gte=${
          sort === "popularity" ? 500 : sort === "vote_average" ? 1000 : 0
        }&with_genres=${genre}`,
        options
      );

      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }

      const data = await response.json();
      setShows(data.results);
      setFilteredShows(data.results); // Set initially filtered shows
    } catch (error) {
      setError("Error fetching data: " + error.message);
    } finally {
      setLoading(false);
    }
  }, [page, options, type_, sort, debouncedYear, genre]);

  useEffect(() => {
    fetchShows();
  }, [fetchShows]);

  useEffect(() => {
    const filterShows = () => {
      let updatedShows = shows;
      if (genre) {
        updatedShows = updatedShows.filter((show) =>
          show.genre_ids.includes(parseInt(genre))
        );
      }
      if (year) {
        updatedShows = updatedShows.filter((show) => {
          const releaseYear =
            type_ === "movie"
              ? show.release_date.split("-")[0]
              : show.first_air_date.split("-")[0];
          return releaseYear === year;
        });
      }
      setFilteredShows(updatedShows);
    };

    filterShows();
  }, [shows, genre, year, type_]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1) {
      setPage(newPage);
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  };

  const handleSortChange = (event) => setSort(event.target.value);
  const handleGenreChange = (event) => setGenre(event.target.value);
  const handleYearChange = (event) => setYear(event.target.value);

  const totalPages = Math.ceil(filteredShows.length / 20);

  return (
    <>
      {loading && <Loading transparent={true} />}
      <div>
        <Slider
          height="min-h-[50vh] sm:max-h-[70vh]"
          movies={filteredShows}
          options={options}
          type={type_}
          setLoading={setLoading}
          setError={setError}
        />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-20 text-white">
        {error ? (
          <div className="text-center text-red-500 mb-4">{error}</div>
        ) : loading ? (
          <div className="text-center text-white mb-4">Loading...</div>
        ) : filteredShows.length === 0 ? (
          <div className="text-center text-white mb-4">
            No shows found. Try adjusting your filters.
          </div>
        ) : (
          <>
            <div
              className="p-4 sm:p-6 rounded-lg mb-8 flex flex-col sm:flex-row sm:justify-between items-start sm:items-center space-y-4 sm:space-y-0 ring-1 ring-gray-700"
              ref={showsRef}
            >
              <div className="flex flex-col sm:flex-row sm:space-x-6 w-full ml-auto justify-end">
                <div className="flex flex-col mb-4 sm:mb-0">
                  <label htmlFor="sort" className="text-white text-sm mb-2">
                    Sort By:
                  </label>
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
                <div className="flex flex-col mb-4 sm:mb-0">
                  <label htmlFor="genre" className="text-white text-sm mb-2">
                    Genre
                  </label>
                  <select
                    id="genre"
                    value={genre}
                    onChange={handleGenreChange}
                    className="p-2 rounded-lg bg-gray-900 text-white border border-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-900 w-full sm:w-auto"
                  >
                    <option value="">Select Genre</option>
                    {genre_.map((genre) => (
                      <option key={genre.id} value={genre.id}>
                        {genre.name}
                      </option>
                    ))}
                  </select>
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
                        aria-label="Increase Year"
                      >
                        ▲
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          setYear((prev) => (prev ? Number(prev) - 1 : 0))
                        }
                        className="p-1 px-2 bg-gray-900 text-white rounded-b hover:bg-gray-800"
                        aria-label="Decrease Year"
                      >
                        ▼
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-center text-3xl sm:text-4xl font-bold text-slate-300 mb-10">
                {type_ === "movie" ? "Movies" : "Series"}
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-5 gap-5 sm:gap-y-8">
                {filteredShows.map((show) => (
                  <ShowCard
                    key={show.id}
                    type_={type_}
                    show={show}
                    type={type}
                  />
                ))}
              </div>
              <Pagination
                totalPages={totalPages}
                page={page}
                onPageChange={handlePageChange}
              />
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default TVShowsPage;
