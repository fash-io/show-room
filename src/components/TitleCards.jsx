import { useContext, useEffect, useState, useMemo } from "react";
import PropTypes from "prop-types"; // Import PropTypes for validation
import Loading from "./Loading";
import Error from "./Error";
import ShowCard from "./ShowCard";
import { options, fetchDetails } from "../utils/api";
import UserContext from "../UserContext";

const TitleCards = ({ title, category, type, userWatchlist }) => {
  const { userData } = useContext(UserContext);
  const [watchlistData, setWatchlistData] = useState([]);
  const [error, setError] = useState(null);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchApiData = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `https://api.themoviedb.org/3/${type}/${category}?language=en-US&page=1`,
          options
        );
        const jsonData = await response.json();
        setData(jsonData.results || []); // Ensure to set the correct structure
      } catch (err) {
        setError("Failed to load API data. Please try again later.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    const fetchWatchListData = async () => {
      const watchlist = userData?.watchList || [];
      const detailedWatchlistData = await Promise.all(
        watchlist.map(async (item) => fetchDetails(item.id, item.type))
      );
      setWatchlistData(detailedWatchlistData);
    };

    if (userWatchlist) {
      fetchWatchListData();
    } else {
      fetchApiData();
    }

    // Cleanup
    return () => {
      setError(null);
      setWatchlistData([]);
    };
  }, [category, type, userWatchlist, userData, setLoading]);

  // Handle loading and error states
  if (loading) return <Loading isSmall={true} />;
  if (error) return <Error message={error} isSmall={true} />;

  const dataToDisplay = userWatchlist ? watchlistData : data;

  return (
    <div className="mt-12 mb-8">
      <h2 className="mb-3 text-lg font-semibold">
        {title || "Popular on Netflix"}
      </h2>
      <div className="overflow-x-scroll whitespace-nowrap divv">
        {dataToDisplay.length > 0 ? (
          dataToDisplay.map((card) => (
            <ShowCard key={card.id} type_={type} show={card} type={2} />
          ))
        ) : (
          <p className="p-5 border border-white/20 rounded">
            No items found in Watchlist.
          </p>
        )}
      </div>
    </div>
  );
};

// Prop types for validation
TitleCards.propTypes = {
  title: PropTypes.string,
  category: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  setLoading: PropTypes.func.isRequired,
};

export default TitleCards;
