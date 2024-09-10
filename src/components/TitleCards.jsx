import { useEffect, useState } from "react";
import { getFirestore } from "firebase/firestore";
import Loading from "./Loading";
import Error from "./Error";
import ShowCard from "./ShowCard";
import { doc, getDoc } from "firebase/firestore";

const TitleCards = (props) => {
  const { title, category, options, type, userWatchlist, user } = props;
  const [apiData, setApiData] = useState([]);
  const [watchlistData, setWatchlistData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const db = getFirestore(); 

  useEffect(() => {
    const fetchApiData = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `https://api.themoviedb.org/3/${type}/${
            category || "now_playing"
          }?language=en-US&page=1`,
          options
        );
        const data = await response.json();
        setApiData(data.results);
      } catch (err) {
        setError("Failed to load API data.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    const fetchWatchlistData = async () => {
      if (!user) {
        setWatchlistData([]);
        setLoading(false);
        return; 
      }

      try {
        setLoading(true);
        const userDocRef = doc(db, "users", user.uid);
        const userDocSnap = await getDoc(userDocRef);

        if (!userDocSnap.exists()) {
          setError("User document not found.");
          setLoading(false);
          return;
        }

        const watchListItems = userDocSnap.data().watchList || [];

        if (watchListItems.length === 0) {
          setError("No items found in watchlist.");
          setLoading(false);
          return;
        }

        const fetchDetails = async (id, type) => {
          try {
            const response = await fetch(
              `https://api.themoviedb.org/3/${
                type === "movie" ? "movie" : "tv"
              }/${id}?language=en-US`,
              options
            );
            const data = await response.json();
            return { ...data, type }; // Return data along with type
          } catch (error) {
            console.error(
              `Error fetching details for ${type} with ID ${id}:`,
              error
            );
            return null;
          }
        };

        const detailedWatchlistData = await Promise.all(
          watchListItems.map(async (item) => {
            const details = await fetchDetails(item.id, item.type);
            return details;
          })
        );

        setWatchlistData(detailedWatchlistData.filter((item) => item !== null));
      } catch (err) {
        setError("Failed to load watchlist data.");
      } finally {
        setLoading(false);
      }
    };

    if (userWatchlist) {
      fetchWatchlistData();
    } else {
      fetchApiData();
    }
  }, [category, options, type, userWatchlist, user, db]);

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <Error message={error} isSmall={true} />;
  }

  const dataToDisplay = userWatchlist ? watchlistData : apiData;

  return (
    <div className="mt-12 mb-8">
      <h2 className="mb-3 text-lg font-semibold">
        {title || "Popular on Netflix"}
      </h2>
      <div className="overflow-x-scroll whitespace-nowrap div">
        {dataToDisplay.length > 0 ? (
          dataToDisplay.map((card) => (
            <ShowCard
              key={card.id}
              show={card}
              type_={card.type || type}
              type={2}
              user={user}
            />
          ))
        ) : (
          <p className="p-5 border border-white/20 rounded">{"No items found in WatchList."}</p>
        )}
      </div>
    </div>
  );
};

export default TitleCards;
