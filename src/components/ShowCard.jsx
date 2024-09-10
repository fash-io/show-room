/* eslint-disable react/prop-types */
import { Link } from "react-router-dom";
import LazyLoader from "./LazyLoader";
import { FaCheck, FaHeart } from "react-icons/fa"; // Importing icon for favorites
import { handleAddToWatched, handleAddToFavorites } from "../utils/firebaseHandlers";

const ShowCard = (props) => {
  const { show, type_, type , user } = props;

  if (type === 1) {
    return (
      <Link
        key={show.id}
        to={`/${type_ === "movie" ? "movie" : "series"}/${show.id}`}
        className="flex flex-col justify-between items-center rounded-lg overflow-hidden transform sm:hover:scale-105 sm:transition-transform sm:duration-300 h-auto"
        aria-label={show.name || show.title}
      >
        <LazyLoader
          src={
            show.backdrop_path
              ? `https://image.tmdb.org/t/p/w500${show.backdrop_path}`
              : "https://via.placeholder.com/150x140?text=No+Image"
          }
          alt={show.name || show.title}
          className="w-full object-cover sm:group-hover:scale-105 sm:transition-transform sm:duration-300"
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

        {/* Add buttons for "Mark as Watched" and "Add to Favorites" */}
        <div className="hidden sm:flex absolute top-3 right-3 space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            className="p-3 rounded-full bg-gray-700 hover:bg-gray-600  duration-200 opacity-50 hover:opacity-100 transition-opacity"
            title="Mark as Watched"
            onClick={(e) => {
              e.preventDefault(); // Prevent Link click
              handleAddToWatched(show.id, type_, user);
            }}
          >
            <FaCheck className="w-4 h-4 text-gray-200 hover:text-gray-100 transition-colors duration-200" />
          </button>
          <button
            className="p-3 rounded-full bg-red-700 hover:bg-red-600  duration-200 opacity-50 hover:opacity-100 transition-opacity"
            title="Add to Favorites"
            onClick={(e) => {
              e.preventDefault(); // Prevent Link click
              handleAddToFavorites(show.id, type_, user);
            }}
          >
            <FaHeart className="w-4 h-4 text-gray-200 hover:text-gray-100 transition-colors duration-200" />
          </button>
        </div>
      </Link>
    );
  } else if (type === 2) {
    return (
      <Link
      to={`/${type_ === "movie" ? "movie" : "series"}/${show.id}`}
      key={show.id}
      className="relative inline-block mr-3 w-48 overflow-hidden group duration-300 rounded-lg group"
    >
      {/* Poster Image */}
      <img
        src={`https://image.tmdb.org/t/p/w500${show.poster_path}`}
        alt={show.original_title || "Movie Poster"}
        className="cursor-pointer object-cover w-full h-64 sm:h-80 rounded-lg group-hover:scale-110 transition-transform duration-300"
      />

      {/* Rating */}
      <div className="absolute bottom-0 left-0 flex opacity-0 items-center justify-center p-2 text-xs text-white bg-black/70 duration-200 rounded-tr-lg group-hover:opacity-100">
        {show.vote_average.toFixed(1)}
      </div>

    </Link>
    );
  }
};

export default ShowCard;
