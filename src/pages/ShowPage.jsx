import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { FaStar, FaStarHalfAlt } from "react-icons/fa";
import Loading from "../components/Loading"; // Import the Loading component
import Error from "../components/Error";
import ShowCard from "../components/ShowCard";
import { onAuthStateChanged } from "firebase/auth";
import { auth, storeWatchList } from "../utils/firebase";
import { toast } from "react-toastify";


const ContentPage = (props) => {
  const { id, type } = useParams();
  const [content, setContent] = useState(null);
  const [credits, setCredits] = useState({ cast: [], crew: [] });
  const [error, setError] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true); // Add loading state
  const { options } = props;
  const [user, setUser] = useState(null);
  
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user_) => {
      if (user_) {
        setUser(user_);
      } else {
        setUser({});
      }
    });

    return () => unsubscribe(); // Cleanup on unmount
  }, [auth]);

  const handleAddToWatchList = async () => {
    try {
      // Example user ID; you should replace it with the actual user ID
      const userId = user.uid; // Replace with actual user ID from your auth system
      await storeWatchList(userId, { id, type });
    } catch (error) {
      console.error("Error adding to watch list:", error);
      toast.error(error)
    }
  };

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
          console.log("Content data:", contentData);
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
      <Navbar />
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

              <div className="flex flex-col sm:flex-row sm:items-center mt-4 items-start gap-4">
            {content.homepage && (
                <div>
                  <a
                    href={content.homepage}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg shadow-md transition duration-200"
                  >
                    Official Website
                  </a>
                </div>
            )}

                <div>
                  <button
                    className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg shadow-md transition duration-200 flex items-center"
                    type="button" onClick={handleAddToWatchList}
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

        {/* Cast and Crew Section */}
        <div className="p-4 sm:p-6 md:p-10 lg:p-20">
          {/* Cast */}
          {credits.cast.length > 0 && (
            <>
              <h2 className="text-2xl sm:text-3xl font-semibold mb-4">Cast</h2>
              <div
                className={`flex overflow-x-scroll space-x-4 pb-4 div1 ${
                  credits.cast.length < 11 ? "div" : ""
                }`}
              >
                {credits.cast.map((actor) => (
                  <Link key={actor.cast_id} to={`/person/${actor.id}`}>
                    <div className="flex-shrink-0 w-28 sm:w-32">
                      <img
                        src={
                          actor.profile_path
                            ? `https://image.tmdb.org/t/p/w300${actor.profile_path}`
                            : "https://via.placeholder.com/150x225?text=No+Image"
                        }
                        alt={actor.name}
                        className="w-full h-40 object-cover rounded-lg shadow-md mb-2"
                      />
                      <p className="text-center font-semibold text-sm sm:text-base">
                        {actor.name}
                      </p>
                      <p className="text-center text-xs sm:text-sm text-gray-400">
                        as {actor.character}
                      </p>
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
                    <div className="flex-shrink-0 w-28 sm:w-32">
                      <img
                        src={
                          director.profile_path
                            ? `https://image.tmdb.org/t/p/w300${director.profile_path}`
                            : "https://via.placeholder.com/150x225?text=No+Image"
                        }
                        alt={director.name}
                        className="w-full h-40 object-cover rounded-lg shadow-md mb-2"
                      />
                      <p className="text-center font-semibold text-sm sm:text-base">
                        {director.name}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </>
          ) : (
            ""
          )}
        </div>

        {recommendations.length > 0 && (
          <div className="p-4 sm:p-6 md:p-10">
            <h2 className="text-2xl sm:text-3xl font-semibold mb-4">
              Recommendations
            </h2>
            <div className="overflow-x-scroll whitespace-nowrap div inset-0 gradient">
              {recommendations.map((rec) => (
                <ShowCard key={rec.id} show={rec} type_={type} type={2} />
              ))}
            </div>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default ContentPage;
