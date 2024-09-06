/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Loading from "./Loading";
import Error from "./Error";
import ShowCard from "./ShowCard";

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
        setError("Failed to load data.", err);
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
          <ShowCard key={card.id} show={card} type_={type} type={2}/>
        ))}
      </div>
    </div>
  );
};

export default TitleCards;
