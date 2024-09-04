import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import GoBackButton from "../components/GoBackButton";
import Loading from "../components/Loading";
import Error from "../components/Error";

const PersonPage = (props) => {
  const { id } = useParams();
  const [actor, setActor] = useState(null);
  const [movies, setActorMovies] = useState(null);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all");
  const [sortType, setSort] = useState("popularity");
  const { options } = props;

  useEffect(() => {
    const fetchActorDetails = async () => {
      try {
        const actorResponse = await fetch(
          `https://api.themoviedb.org/3/person/${id}?language=en-US`,
          options
        );
        const actorData = await actorResponse.json();
        if (actorResponse.ok) {
          setActor(actorData);
        } else {
          setError(actorData.status_message || "Error fetching actor data.");
        }

        const moviesResponse = await fetch(
          `https://api.themoviedb.org/3/person/${id}/combined_credits?language=en-US`,
          options
        );
        const movieData = await moviesResponse.json();
        console.log(movieData);
        if (moviesResponse.ok) {
          setActorMovies(movieData);
        } else {
          setError(movieData.status_message || "Error fetching movies.");
        }
      } catch (err) {
        console.error("Failed to fetch actor details or credits:", err);
        setError("Failed to load actor details.");
      }
    };
    fetchActorDetails();
  }, [id, options]);

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };

  const handleSortChange = (e) => {
    setSort(e.target.value);
  };
  // Filter TV shows with more than 2 episodes or all movies if not a TV show
const movies_ = movies?.cast?.filter((credit) => {
  if (credit.media_type === "tv") {
    return credit.episode_count > 2;
  }
  return true; // Keep all movies (or if media_type isn't 'tv')
}) || [];

// Filter movies based on the selected filter
const filteredMovies = movies_?.length
  ? filter === "all"
    ? movies_
    : movies_.filter((credit) => credit.media_type === filter)
  : [];

// Filter director jobs from the crew based on selected filter
const filteredMoviesDir = movies?.crew?.length
  ? filter === "all"
    ? movies.crew.filter((member) => member.job === "Director")
    : movies.crew
        .filter((credit) => credit.media_type === filter)
        .filter((member) => member.job === "Director")
  : [];


    const sortedMoviesDir = [...filteredMoviesDir].sort((a, b) => {
      switch (sortType) {
        case "name":
          return (a.title || a.name).localeCompare(b.title || b.name);
        case "release_date":
          return (a.release_date || a.first_air_date || "").localeCompare(
            b.release_date || b.first_air_date || ""
          );
        case "popularity":
          return b.popularity - a.popularity;
        case "rating":
          return b.vote_average - a.vote_average;
        default:
          return 0;
      }
    });

  const sortedMovies = [...filteredMovies].sort((a, b) => {
    switch (sortType) {
      case "name":
        return (a.title || a.name).localeCompare(b.title || b.name);
      case "release_date":
        return (a.release_date || a.first_air_date || "").localeCompare(
          b.release_date || b.first_air_date || ""
        );
      case "popularity":
        return b.popularity - a.popularity;
      case "rating":
        return b.vote_average - a.vote_average;
      default:
        return 0;
    }
  });

  if (error) {
    return <Error error={error} />;
  }

  if (!actor || !movies) {
    return <Loading />;
  }

  return (
    <>
      <Navbar />
      <div className="relative min-h-screen bg-black text-white p-4 md:p-8 lg:p-20">
        <GoBackButton />

        <div className="flex flex-col lg:flex-row items-start lg:space-x-12 mt-8 lg:mt-0 p-10">
          {/* Actor Profile Image */}
          <div className="lg:w-1/3 flex justify-center lg:justify-start mb-8 lg:mb-0 lg:sticky lg:top-32 max-sm:w-full">
            <img
              src={
                actor.profile_path
                  ? `https://image.tmdb.org/t/p/w500${actor.profile_path}`
                  : "https://via.placeholder.com/300x450?text=No+Image"
              }
              alt={actor.name}
              className="rounded-lg shadow-xl border border-gray-700 w-48 h-auto lg:w-full lg:max-w-xs"
            />
          </div>

          {/* Actor Information */}
          <div className="lg:w-2/3 space-y-4">
            <h1 className="text-3xl lg:text-5xl font-bold mb-4 bg-clip-text text-transparent inline-block"
            style={{
              backgroundImage: "linear-gradient(to right, #ff7e5f, #1a2a6c)",
            }}>
              {actor.name}
            </h1>
            <p className="text-base lg:text-lg leading-relaxed">
              {actor.biography}
            </p>

            {/* Additional Details */}
            <div className="mt-6 space-y-2">
              <p>
                <span className="font-semibold text-slate-500">Known For:</span>{" "}
                {actor.known_for_department}
              </p>
              <p>
                <span className="font-semibold text-slate-500">Birthday:</span>{" "}
                {actor.birthday}
              </p>
              <p>
                <span className="font-semibold text-slate-500">Place of Birth:</span>{" "}
                {actor.place_of_birth}
              </p>
              {actor.homepage && (
                <p>
                  <span className="font-semibold text-slate-500">Official Website:</span>{" "}
                  <a
                    href={actor.homepage}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:underline"
                  >
                    {actor.homepage}
                  </a>
                </p>
              )}
              {actor.imdb_id && (
                <p>
                  <span className="font-semibold text-slate-500">IMDb Profile:</span>{" "}
                  <a
                    href={`https://www.imdb.com/name/${actor.imdb_id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:underline"
                  >
                    IMDb
                  </a>
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Filter and Movie/Series Display */}
        {(actor.known_for_department === "Acting" ? sortedMovies.length : sortedMoviesDir.length) > 0 && (
          <div className="mt-12">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
              <h2 className="text-2xl md:text-4xl font-semibold">
                Filmography
              </h2>
              <div className="flex gap-4">
                <select
                  value={filter}
                  onChange={handleFilterChange}
                  className="bg-gray-800 text-white px-4 py-2 rounded-full shadow-md hover:bg-gray-700 transition"
                >
                  <option value="all">All</option>
                  <option value="movie">Movies</option>
                  <option value="tv">Series</option>
                </select>
                <select
                  value={sortType}
                  onChange={handleSortChange}
                  className="bg-gray-800 text-white px-4 py-2 rounded-full shadow-md hover:bg-gray-700 transition"
                >
                  <option value="popularity">Popular</option>
                  <option value="rating">Rating</option>
                  <option value="name">Name</option>
                  <option value="release_date">Release Date</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {(actor.known_for_department === "Acting" ? sortedMovies : sortedMoviesDir).map((credit) => (
                <Link
                  key={credit.credit_id}
                  to={`/${credit.media_type === "movie" ? "movie" : "series"}/${
                    credit.id
                  }`}
                  className="group bg-gray-800 rounded-t-lg overflow-hidden shadow-lg transition-transform transform hover:scale-105 hover:shadow-2xl w-full h-72 sm:h-80 lg:h-96 flex items-end"
                >
                  <img
                    src={
                      credit.poster_path
                        ? `https://image.tmdb.org/t/p/w400${credit.poster_path}`
                        : "https://via.placeholder.com/200x300?text=No+Image"
                    }
                    alt={credit.title || credit.name}
                    className="w-full h-72 sm:h-80 lg:h-96 object-cover rounded-t-lg absolute -z-10"
                  />
                  <div className="pb-0 p-4 w-full inset-10 bg-gradient-to-t from-black to-transparent" style={{ textShadow: "0px 0px 5px rgba(0, 0, 0, 1)" }}>
                    {credit.character ? (<h3 className="text-gray-100 text-sm">AS: {credit.character}</h3>) : (<p className="text-gray-400">{credit.job}</p>)}
                    <p className="text-gray-400 text-xs">
                      {credit.release_date || credit.first_air_date}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default PersonPage;
