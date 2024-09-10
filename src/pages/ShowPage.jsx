import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  FaStar,
  FaStarHalfAlt,
  FaHeart,
  FaCheck,
  // FaHeartBroken,
  // FaTimes,
} from "react-icons/fa";
import Loading from "../components/Loading"; // Import the Loading component
import Error from "../components/Error";
import ShowCard from "../components/ShowCard";
import {
  handleAddToFavorites,
  handleAddToWatchList,
  handleAddToWatched,
  // handleRemoveFavoriteItem,
  // handleRemoveWatchListItem,
  // handleRemoveWatchedItem,
} from "../utils/firebaseHandlers";
import SlidingImages from "../components/SlidingImages";
// import { fetchFavorites, fetchWatchList, fetchWatched } from "../utils/firebaseHandlers";

const ContentPage = (props) => {
  

  const { id, type } = useParams();
  const [content, setContent] = useState(null);
  const [credits, setCredits] = useState({ cast: [], crew: [] });
  const [error, setError] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true); // Add loading state
  // const [favorites, setFavorite] = useState([]);
  // const [watchList, setWatchList] = useState([]);
  // const [watched, setWatched] = useState([]);
  const { options, user } = props;

  useEffect(() => {
    const fetchContentDetails = async () => {
      setLoading(true); // Set loading to true before fetching data
      try {
        const contentResponse = await fetch(
          `https://api.themoviedb.org/3/${
            type === "series" ? "tv" : "movie"
          }/${id}?language=en-US`,
          options
        );
        const contentData = await contentResponse.json();
        if (contentResponse.ok) {
          setContent(contentData);
        } else {
          setError(contentData.status_message);
        }

        const creditsResponse = await fetch(
          `https://api.themoviedb.org/3/${
            type === "series" ? "tv" : "movie"
          }/${id}/credits`,
          options
        );
        const creditsData = await creditsResponse.json();
        if (creditsResponse.ok) {
          setCredits(creditsData);
        } else {
          setError(creditsData.status_message);
        }

        const recommendationsResponse = await fetch(
          `https://api.themoviedb.org/3/${
            type === "series" ? "tv" : "movie"
          }/${id}/recommendations?language=en-US&page=1`,
          options
        );
        const recommendationsData = await recommendationsResponse.json();
        if (recommendationsResponse.ok) {
          setRecommendations(recommendationsData.results);
        } else {
          setError(recommendationsData.status_message);
        }
      } catch (err) {
        console.error("Failed to fetch content details or credits:", err);
        setError("Failed to load content details.");
      } finally {
        setLoading(false); // Set loading to false after data is fetched
      }
    };
  //   setWatched(fetchWatched(user));
  // setWatchList(fetchWatchList(user));
  // setFavorite(fetchFavorites(user));

    fetchContentDetails();
  }, [id, type]);

  if (error) {
    return <Error />;
  }

  if (loading || !content) {
    return <Loading />;
  }

  const directors =
    type === "series"
      ? content.created_by
      : credits.crew.filter((member) => member.job === "Director");

  return (
    <>
      <div className="text-white min-h-screen">
        {/* Hero Image Section */}
        <div className="relative w-full h-96 sm:h-[600px] max-h-[75vh]">
          <img
            src={`https://image.tmdb.org/t/p/original${
              content.backdrop_path || content.poster_path
            }`}
            alt={content.title || content.name}
            className="object-cover w-full h-full object-top"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent" />
          <div className="absolute bottom-10 left-5 sm:left-10 p-4 sm:p-8">
            <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold mb-2">
              {content.title || content.name}
            </h1>
            <p className="text-sm sm:text-xl italic">{content.tagline}</p>
          </div>
        </div>

        {/* Content Details Section */}
        <div className="p-4 sm:p-6 md:p-10 lg:p-20 grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-10">
          {/* Content Poster */}
          <div className="flex justify-center md:justify-start">
            <img
              src={`https://image.tmdb.org/t/p/original${content.poster_path}`}
              alt={`${content.title || content.name} Poster`}
              className="w-64 sm:w-80 rounded-lg shadow-lg"
            />
          </div>

          {/* Content Info */}
          <div className="col-span-2 space-y-4">
            <h2 className="text-2xl sm:text-3xl font-bold ">Overview</h2>
            <p className="text-sm sm:text-lg">{content.overview}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm sm:text-lg">
              <div>
                <p>
                  <span className="font-semibold text-slate-500">
                    Release Date:
                  </span>{" "}
                  {content.release_date || content.first_air_date}
                </p>
                {content.runtime || content.episode_run_time[0] ? (
                  <p>
                    <span className="font-semibold text-slate-500">
                      Runtime:
                    </span>{" "}
                    {type === "movie"
                      ? `${
                          content.runtime
                            ? `${(content.runtime / 60).toFixed(0)} h ${
                                content.runtime % 60
                              } m`
                            : "N/A"
                        }`
                      : content.episode_run_time
                      ? `${content.episode_run_time[0]} minutes / episode`
                      : "N/A"}
                  </p>
                ) : (
                  ""
                )}
                <p>
                  <span className="font-semibold text-slate-500">Genres:</span>{" "}
                  {content.genres.map((genre) => genre.name).join(",  ")}
                </p>
                <p className="flex items-center">
                  <span className="font-semibold text-slate-500">Rating:</span>{" "}
                  <span className="flex items-center ml-2">
                    {Array.from({ length: 5 }, (_, i) => {
                      // Convert the rating to a scale of 0-5
                      const starRating = (content.vote_average / 2).toFixed(1);
                      const fullStars = Math.floor(starRating);
                      const hasHalfStar = starRating - fullStars >= 0.5;

                      if (i < fullStars) {
                        // Full star
                        return <FaStar key={i} className="text-yellow-400" />;
                      } else if (i === fullStars && hasHalfStar) {
                        // Half star
                        return (
                          <FaStarHalfAlt key={i} className="text-yellow-400" />
                        );
                      } else {
                        // Empty star
                        return <FaStar key={i} className="text-gray-500" />;
                      }
                    })}
                    <span className="ml-2">
                      {(content.vote_average / 2).toFixed(1)} / 5
                    </span>
                  </span>
                </p>
              </div>
              <div>
                {content.budget ? (
                  <p>
                    <span className="font-semibold text-slate-500">
                      Budget:
                    </span>{" "}
                    ${content.budget.toLocaleString()}
                  </p>
                ) : (
                  ""
                )}
                {content.revenue ? (
                  <p>
                    <span className="font-semibold text-slate-500">
                      Revenue:
                    </span>{" "}
                    ${content.revenue.toLocaleString()}
                  </p>
                ) : (
                  ""
                )}
                <p>
                  <span className="font-semibold text-slate-500">Status:</span>{" "}
                  {content.status === "Ended"
                    ? content.status + "  " + content.last_air_date
                    : content.status}
                </p>
                <p>
                  <span className="font-semibold text-slate-500">
                    Original Language:
                  </span>{" "}
                  {content.original_language}
                </p>
                {type === "series" && (
                  <>
                    <p>
                      <span className="font-semibold text-slate-500">
                        Number of Seasons:
                      </span>{" "}
                      {content.number_of_seasons}
                    </p>
                    <p>
                      <span className="font-semibold text-slate-500">
                        Number of Episodes:
                      </span>{" "}
                      {content.number_of_episodes}
                    </p>
                  </>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm sm:text-lg">
              <div className="flex flex-col gap-4">
                <div className="flex flex-col sm:flex-row sm:items-center mt-4 items-start gap-4">
                  {content.homepage && (
                    <div>
                      <a
                        href={content.homepage}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-lg shadow-md transition duration-200"
                      >
                        Official Website
                      </a>
                    </div>
                  )}

                  <div className="flex flex-col gap-3 items-center">
                    <button
                      className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg shadow-md transition duration-200 flex items-center"
                      type="button"
                      onClick={() =>
                        handleAddToWatchList(content.id, type, user)
                      }
                    >
                      <span className="mr-2">Add to Watch List</span>
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M5 12l5 5L20 7"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
                <div>
                  <button
                    className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg shadow-md transition duration-200"
                    title="Add to favorites"
                    onClick={() => handleAddToFavorites(content.id, type, user)}
                  >
                    <FaHeart className="" />
                  </button>
                  <button
                    className="bg-slate-500 ml-3 hover:bg-slate-600 text-white py-2 px-4 rounded-lg shadow-md transition duration-200"
                    title="Mark as watched"
                    onClick={() => handleAddToWatched(content.id, type, user)}
                  >
                    <FaCheck className="" />
                  </button>
                  {/* <button
                    className="bg-red-500 ml-3 hover:bg-red-600 text-white py-2 px-4 rounded-lg shadow-md transition duration-200"
                    title="Mark as watched"
                    onClick={() =>
                      handleRemoveFavoriteItem(content.id, type, user)
                    }
                  >
                    <FaHeartBroken className="" />
                  </button>
                  <button
                    className="bg-slate-500 ml-3 hover:bg-slate-600 text-white py-2 px-4 rounded-lg shadow-md transition duration-200"
                    title="Mark as watched"
                    onClick={() =>
                      handleRemoveWatchedItem(content.id, type, user)
                    }
                  >
                    <FaTimes className="" />
                  </button>
                  <button
                    className="bg-slate-500 ml-3 hover:bg-slate-600 text-white py-2 px-4 rounded-lg shadow-md transition duration-200"
                    title="Mark as watched"
                    onClick={() =>
                      handleRemoveFavoriteItem(content.id, type, user)
                    }
                  >
                    <FaTimes className="" />
                  </button> */}
                </div>
              </div>
              <SlidingImages images={content.production_companies} />
            </div>
          </div>
        </div>
        {type === "series" && content.next_episode_to_air && (
          <div className="px-4 sm:px-6 md:px-10 lg:px-20">
            <h2 className="text-2xl sm:text-3xl font-semibold mb-4">
              Next Episode
            </h2>
            <p>
              <span className="font-semibold">Title:</span>{" "}
              {content.next_episode_to_air.name ||
                "Episode " + content.next_episode_to_air.episode_number}
            </p>
            <p>
              <span className="font-semibold">Air Date:</span>{" "}
              {content.next_episode_to_air.air_date}
            </p>
            <p>
              <span className="font-semibold">Season:</span>{" "}
              {content.next_episode_to_air.season_number}
            </p>
            <p>
              <span className="font-semibold">Episode:</span>{" "}
              {content.next_episode_to_air.episode_number}
            </p>
          </div>
        )}

        {/* Cast and Crew Section */}
        <div className="p-4 sm:p-6 md:p-10 lg:p-20">
          {/* Cast */}
          {credits.cast.length > 0 && (
            <>
              <h2 className="text-2xl sm:text-3xl font-semibold mb-4">Cast</h2>
              <div
                className={`flex overflow-x-scroll space-x-4 sm:space-x-7 pb-4 ${
                  credits.cast.length < 11 ? "div" : "div"
                }`}
              >
                {credits.cast.map((actor) => (
                  <Link key={actor.id} to={`/person/${actor.id}`}>
                    <div className="flex-shrink-0 w-40 sm:w-48 divvv group">
                      <div className="overflow-hidden w-full h-full">
                        <img
                          src={
                            actor.profile_path
                              ? `https://image.tmdb.org/t/p/w300${actor.profile_path}`
                              : "https://via.placeholder.com/150x225?text=No+Image"
                          }
                          alt={actor.name}
                          className="w-full h-52 object-top object-cover z-50 group-hover:scale-110 duration-500"
                        />
                      </div>
                      <div className="divv pt-2 bg-[#191919] ">
                        <div className="absolute z-50 px-1 h-full flex flex-col justify-between pb-5 pr-7">
                          <p className="text-center font-semibold text-sm sm:text-base duration-200  hover:text-white group-hover:text-white">
                            {actor.name}
                          </p>
                          <p className=" text-xs sm:text-sm  group-hover:text-gray-200 duration-200 text-gray-400">
                            as {actor.character}
                          </p>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </>
          )}

          {/* Director */}
          {directors.length > 0 ? (
            <>
              <h2 className="text-2xl sm:text-3xl font-semibold mt-8 mb-4">
                Director
              </h2>
              <div className="flex overflow-x-scroll space-x-4 pb-4 div">
                {directors.map((director) => (
                  <Link key={director.id} to={`/person/${director.id}`}>
                    <div className="flex-shrink-0 w-40 sm:w-48 divvv group overflow-hidden ">
                      <div className="overflow-hidden w-full h-full">
                        <img
                          src={
                            director.profile_path
                              ? `https://image.tmdb.org/t/p/w300${director.profile_path}`
                              : "https://via.placeholder.com/150x225?text=No+Image"
                          }
                          alt={director.name}
                          className="w-full h-52 object-top object-cover z-50 group-hover:scale-105 duration-500"
                        />
                      </div>
                      <div className="divv pt-2 bg-[#191919]">
                        <div className="absolute z-50 px-1 h-full flex flex-col justify-between pb-5 pl-7">
                          <p className="text-center font-semibold text-sm sm:text-base duration-200  hover:text-white group-hover:text-white">
                            {director.name}
                          </p>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </>
          ) : (
            ""
          )}
        </div>

        {/* Seasons Section (Only for TV Series) */}
        {type === "series" && (
          <div className="p-4 sm:p-6 md:p-10 lg:p-20">
            <h2 className="text-2xl sm:text-3xl font-semibold mb-6">Seasons</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 md:gap-8">
              {content.seasons.map((season) => (
                <div
                  key={season.id}
                  className="bg-gray-900 rounded-lg shadow-lg p-4"
                >
                  <img
                    src={
                      season.poster_path
                        ? `https://image.tmdb.org/t/p/w500${season.poster_path}`
                        : "https://via.placeholder.com/150x225?text=No+Image"
                    }
                    alt={`Season ${season.season_number} Poster`}
                    className=" rounded-lg mb-4 object-scale-down"
                  />
                  <h3 className="text-xl sm:text-2xl font-semibold mb-2">
                    {season.name}
                  </h3>
                  <p>
                    <span className="font-semibold">Air Date:</span>{" "}
                    {season.air_date || "N/A"}
                  </p>
                  <p>
                    <span className="font-semibold">Episodes:</span>{" "}
                    {season.episode_count}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
        {content.belongs_to_collection && (
          <>
            <div className="p-4 sm:p-6 md:p-10 lg:p-20 max-w-full flex flex-col">
              <h2 className="text-2xl sm:text-3xl font-semibold mb-6">
                Collection
              </h2>
              <Link
                to={`/collection/${content.belongs_to_collection.id}`}
                className="max-w-52 rounded-lg shadow-lg p-4 flex flex-col w-full group divvv"
              >
                <div className=" max-w-min flex flex-col w-full">
                  <img
                    src={
                      content.belongs_to_collection.backdrop_path
                        ? `https://image.tmdb.org/t/p/w500${content.belongs_to_collection.backdrop_path}`
                        : "https://via.placeholder.com/150x225?text=No+Image"
                    }
                    alt="Collection Poster"
                    className=" rounded-lg mb-4 object-cover min-w-72 md:min-w-96 group-hover:scale-105 duration-500"
                  />
                  <h3 className="text-xl sm:text-2xl font-semibold mb-2 divv">
                    {content.belongs_to_collection.name}
                  </h3>
                </div>
              </Link>
            </div>
          </>
        )}
        {/* Recommendations */}
        {recommendations.length > 0 && (
          <div className="p-4 sm:p-6 md:p-10">
            <h2 className="text-2xl sm:text-3xl font-semibold mb-4">
              Recommendations
            </h2>
            <div className="overflow-x-scroll whitespace-nowrap div inset-0 gradient">
              {recommendations.map((rec, index) => (
                <ShowCard
                  key={`${rec.id} + ${index} `}
                  show={rec}
                  type_={type}
                  type={2}
                  user={user}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ContentPage;
