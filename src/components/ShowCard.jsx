import React from "react";
import { Link } from "react-router-dom";
import LazyLoader from "./LazyLoader";

const ShowCard = (props) => {
  const { show, type_, type } = props;

  if  (type === 1) {
    return (
      <Link
        key={show.id}
        to={`/${type_ === "movie" ? "movie" : "series"}/${show.id}`}
        className="block bg-gray-800 rounded-lg overflow-hidden transform sm:hover:scale-105 sm:transition-transform sm:duration-300 h-auto"
        aria-label={show.name || show.title}
      >
        <LazyLoader
          src={
            show.backdrop_path
              ? `https://image.tmdb.org/t/p/w500${show.backdrop_path}`
              : "https://via.placeholder.com/150x140?text=No+Image"
          }
          alt={show.name || show.title}
          className="w-full object-cover"
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
    );
  } else if (type === 2) {
    return (
      <Link
      to={`/${type_ === "movie" ? "movie" : "series"}/${show.id}`}
      key={show.id}
      className="relative inline-block mr-3 w-auto overflow-hidden title-cards"
    >
      <img
        src={`https://image.tmdb.org/t/p/w500${show.poster_path}`}
        alt={show.original_title || "Movie Poster"}
        className="rounded cursor-pointer sm:w-auto object-scale-down h-64 sm:h-80 w-auto"
      />
    </Link>
    )
  }
};

export default ShowCard;
