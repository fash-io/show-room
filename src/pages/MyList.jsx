import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Loading from "../components/Loading";
import ShowCard from "../components/ShowCard";
import { getFirestore, doc, getDoc, updateDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../utils/firebase";
import { FaCheck, FaHeart } from "react-icons/fa"; // Importing icon for favorites

const MyListPage = () => {
  const [shows, setShows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const db = getFirestore();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user_) => {
      if (user_) {
        setUser(user_);
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe(); // Cleanup on unmount
  }, []);

  useEffect(() => {
    const fetchWatchlistData = async () => {
      if (!user) {
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
              `https://api.themoviedb.org/3/${type === "movie" ? "movie" : "tv"}/${id}?language=en-US`
            );
            const data = await response.json(); // Awaiting the JSON response
            return { ...data, type }; // Return data along with type
          } catch (error) {
            console.error(`Error fetching details for ${type} with ID ${id}:`, error);
            return null;
          }
        };

        const detailedWatchlistData = await Promise.all(
          watchListItems.map(async (item) => {
            const details = await fetchDetails(item.id, item.type);
            return details;
          })
        );

        setShows(detailedWatchlistData.filter(item => item !== null));
      } catch (err) {
        setError("Failed to load watchlist data.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchWatchlistData();
  }, [user, db]);

  const handleWatched = async (showId) => {
    if (user) {
      try {
        const userDocRef = doc(db, "users", user.uid);
        // Update the watchlist or another relevant field
        await updateDoc(userDocRef, {
          // Example update: mark show as watched
          watchList: arrayRemove({ id: showId, type: "movie" }) // Adjust type as necessary
        });
        // Optionally update local state or UI here
      } catch (error) {
        console.error("Failed to mark as watched:", error);
      }
    }
  };

  const handleFavorite = async (showId) => {
    if (user) {
      try {
        const userDocRef = doc(db, "users", user.uid);
        // Update the favorites or another relevant field
        await updateDoc(userDocRef, {
          // Example update: add to favorites
          favorites: arrayUnion(showId) // Adjust to your data structure
        });
        // Optionally update local state or UI here
      } catch (error) {
        console.error("Failed to add to favorites:", error);
      }
    }
  };

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-20 text-white">
        {loading ? (
          <Loading />
        ) : error ? (
          <div className="text-center text-red-500 mb-4">{error}</div>
        ) : shows.length === 0 ? (
          <div className="text-center text-white mb-4">
            No shows found in your list.
          </div>
        ) : (
          <>
            {/* Main Content Area */}
            <div>
              <h2 className="text-center text-3xl sm:text-4xl font-bold text-slate-300 mb-10">
                My List
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8">
                {shows.map((show) => (
                  <div key={show.id} className="relative group">
                    <ShowCard show={show} type_={show.type} type={1} />
                    <div className="absolute top-2 right-2 flex space-x-2">
                      <button
                        onClick={() => handleWatched(show.id)}
                        className="p-2 rounded-full bg-gray-900 hover:bg-gray-800 transition-colors duration-200"
                        title="Mark as Watched"
                      >
                        <FaCheck className="w-6 h-6 text-gray-200/50 hover:text-gray-200 duration-200"/>
                      </button>
                      <button
                        onClick={() => handleFavorite(show.id)}
                        className="p-2 rounded-full bg-gray-900 hover:bg-gray-800 transition-colors duration-200"
                        title="Add to Favorites"
                      >
                        <FaHeart className="w-6 h-6 text-red-500/50 hover:text-red-500 duration-200"/>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
      <Footer />
    </>
  );
};

export default MyListPage;
