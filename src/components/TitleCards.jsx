/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Loading from "./Loading";
import Error from "./Error";

const TitleCards = (props) => {
  const { title, category, options, type } = props;
  const [apiData, setApiData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `https://api.themoviedb.org/3/${type}/${category || "now_playing"}?language=en-US&page=1`,
          options
        );
        const data = await response.json();
        setApiData(data.results);
      } catch (err) {
        setError("Failed to load data.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [category, options]);

  if (loading) {
    return (
      <Loading/>
    );
  }

  if (error) {
    return (
      <Error/>
    );
  }

  return (
    <div className="mt-12 mb-8 ">
      <h2 className="mb-3 text-lg font-semibold">
        {title ? title : "Popular on Netflix"}
      </h2>
      <div className="overflow-x-scroll whitespace-nowrap div inset-0 gradient">
        {apiData.map((card) => (
          <Link
            to={`/${type === "movie" ? "movie" : "series"}/${card.id}`}
            key={card.id}
            className="relative inline-block mr-3 w-auto overflow-hidden title-cards"
          >
            <img
              src={`https://image.tmdb.org/t/p/w500${ card.poster_path}`}
              alt={card.original_title || "Movie Poster"}
              className="rounded cursor-pointer sm:w-auto object-scale-down h-80 w-auto"
            />
            {/* <p className="absolute bottom-3 left-3 text-white bg-black bg-opacity-50 p-1 rounded">
              {card.title || card.name}
            </p> */}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default TitleCards;
