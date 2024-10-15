import { useState, useEffect, useCallback, useRef } from "react";
import Slider from "../components/Slider";
import useDebounce from "../utils/useDebounce";
import { movieGenre, tvGenre } from "../constants";
import ShowCard from "../components/ShowCard";
import Pagination from "../components/Pagination";
import { options } from "../utils/api";
import { useLocation } from "react-router-dom";
import { useWindowWidth } from "../utils/windowWidth";
import LoadingSpinner from "../components/LoadingSpinner"; // Spinner Component
import { CSSTransition, TransitionGroup } from "react-transition-group"; // Animation import

const TVShowsPage = () => {
  const { pathname } = useLocation();
  const [shows, setShows] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sort, setSort] = useState("popularity");
  const [year, setYear] = useState("");
  const [genre, setGenre] = useState("");
  const [genres, setGenres] = useState([]);
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
        `https://api.themoviedb.org/3/discover/${type_}?page=${page}&sort_by=${sort}.desc&${yearParam}&vote_count.gte=${
          sort === "popularity" ? 400 : sort === "vote_average" ? 400 : 0
        }${genres.length > 0 ? `&with_genres=${genres.join(",")}` : ""}`,
        options
      );

      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }

      const data = await response.json();
      setTotalPages(data.total_pages);
      setShows(data.results);
    } catch (error) {
      setError("Error fetching data: " + error.message);
    } finally {
      setLoading(false);
    }
  }, [page, options, type_, sort, debouncedYear, genres]);

  useEffect(() => {
    fetchShows();
  }, [fetchShows]);

  useEffect(() => {
    setPage(1);
  }, [sort, type, year, genre]);

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

  useEffect(() => {
    if (genre && !genres.includes(genre)) {
      setGenres([...genres, genre]);
    }
  }, [genre]);

  const removeGenre = (genreToRemove) => {
    setGenres(genres.filter((g) => g !== genreToRemove));
  };

  return (
    <>
      <div>
        <Slider
          height="min-h-[50vh] sm:max-h-[70vh]"
          movies={shows}
          options={options}
          type={type_}
          setLoading={setLoading}
          setError={setError}
        />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-20 text-white">
        <div className="mb-8">
          <div
            className="p-4 sm:p-6 rounded-lg flex flex-col sm:flex-row sm:justify-between items-start sm:items-center space-y-4 sm:space-y-0 ring-1 ring-gray-700"
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

          {/* Genres Display */}
          {genres.length > 0 && (
            <div className="my-6 flex items-center justify-end duration-200">
              <TransitionGroup className="flex">
                {genres.map((genre, i) => (
                  <CSSTransition key={genre} timeout={300} classNames="fade">
                    <div className="bg-gray-900 text-white border-blue-900/50 border rounded-full flex justify-between items-center p-2 gap-2 py-0 duration-200 ml-2">
                      <span className="font-light">
                        {genre_.find((g) => g.id === parseInt(genre))?.name}
                      </span>
                      <i
                        className="fa-solid fa-x text-[8px] font-extralight text-white/50 hover:text-white hover:scale-150 duration-200 cursor-pointer"
                        onClick={() => removeGenre(genre)}
                      ></i>
                    </div>
                  </CSSTransition>
                ))}
              </TransitionGroup>
            </div>
          )}
        </div>

        {/* Shows and Pagination */}
        <div>
          <h2 className="text-center text-3xl sm:text-4xl font-bold text-slate-300 mb-10">
            {type_ === "movie" ? "Movies" : "Series"}
          </h2>
          {error ? (
            <div className="text-center text-red-500 mb-4">
              {error}
              <button
                className="ml-3 p-2 bg-gray-900 text-white rounded-lg"
                onClick={fetchShows}
              >
                Try again
              </button>
            </div>
          ) : loading ? (
            <LoadingSpinner />
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-5 gap-5 sm:gap-y-8">
              {shows.map((show) => (
                <ShowCard key={show.id} type_={type_} show={show} type={type} />
              ))}
            </div>
          )}
          <div className="flex justify-center py-8">
            <Pagination
              page={page}
              totalPages={totalPages}
              handlePageChange={handlePageChange}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default TVShowsPage;
