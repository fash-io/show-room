import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Loading from "../components/Loading";
import ShowCard from "../components/ShowCard";
import Error from "../components/Error";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../utils/firebase"; // Adjust the import based on your file structure

const MyListPage = ({ options, user }) => {
  const [favorites, setFavorites] = useState([]);
  const [watchList, setWatchlist] = useState([]);
  const [watched, setWatched] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState([]);
  const [dataSet, setDataSet] = useState("favorite");
  const [mediaType, setMediaType] = useState("all"); // 'all', 'movie', 'tv'

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
        const favoriteItems = userDocSnap.data().favorite || [];
        const watchedItems = userDocSnap.data().watched || [];

        const fetchDetails = async (id, type) => {
          try {
            const response = await fetch(
              `https://api.themoviedb.org/3/${
                type === "movie" ? "movie" : "tv"
              }/${id}?language=en-US`, options
            );
            const data = await response.json();
            return { ...data, type };
          } catch (error) {
            console.error(
              `Error fetching details for ${type} with ID ${id}:`,
              error
            );
            return null;
          }
        };

        const favoriteDetails = await Promise.all(
          favoriteItems.map(async (item) => {
            const details = await fetchDetails(item.id, item.type);
            return details;
          })
        );

        const watchlistDetails = await Promise.all(
          watchListItems.map(async (item) => {
            const details = await fetchDetails(item.id, item.type);
            return details;
          })
        );

        const watchedDetails = await Promise.all(
          watchedItems.map(async (item) => {
            const details = await fetchDetails(item.id, item.type);
            return details;
          })
        );

        setFavorites(favoriteDetails.filter((item) => item !== null));
        setWatchlist(watchlistDetails.filter((item) => item !== null));
        setWatched(watchedDetails.filter((item) => item !== null));

        // Update data based on the current dataSet and mediaType
        handleSetDataSet(dataSet, mediaType);
      } catch (err) {
        setError("Failed to load data.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchWatchlistData();
  }, [options, dataSet, user, mediaType]);

  const handleSetDataSet = (set, type) => {
    setDataSet(set);
    let filteredData;
    switch (set) {
      case "watchList":
        filteredData = watchList;
        break;
      case "watched":
        filteredData = watched;
        break;
      case "favorite":
        filteredData = favorites;
        break;
      default:
        filteredData = favorites;
    }

    // Filter by mediaType
    if (type !== "all") {
      type === "movie" ? (type = "movie") : (type = "series");
      console.log(type);
      filteredData = filteredData.filter(item => item.type === type);
    }
    setData(filteredData);
  };

  if (!user) {
    return (
      <>
        <Navbar user={user} />
        <div className="h-[100vh] flex items-center justify-center">
          <Error error={"Not Logged In"} />
        </div>
      </>
    );
  }

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <Error error={error} />;
  }

  return (
    <>
      <Navbar user={user} />
      <div className="min-h-screen text-white py-20 px-4 sm:px-8 lg:px-8">
        {/* Small Navigation Bar */}
        <div className="flex flex-col lg:flex-row items-center justify-between mb-10 space-y-4 lg:space-y-0 sm:px-20">
          {/* Media Type Selector */}
          <div className="flex flex-wrap items-center space-x-4">
            {["all", "movie", "tv"].map((type) => (
              <button
                key={type}
                onClick={() => setMediaType(type)}
                className={`px-4 py-2 rounded-full ${
                  mediaType === type
                    ? `${
                        type === "all"
                          ? "bg-blue-500"
                          : type === "movie"
                          ? "bg-green-500"
                          : "bg-purple-500"
                      } text-white`
                    : "bg-gray-700 text-gray-300"
                } hover:bg-${
                  type === "all"
                    ? "blue"
                    : type === "movie"
                    ? "green"
                    : "purple"
                }-600 transition-colors`}
              >
                {type === "all"
                  ? "All"
                  : type === "movie"
                  ? "Movies"
                  : "TV Shows"}
              </button>
            ))}
          </div>

          {/* Data Set Selector */}
          <div className="flex flex-wrap items-center space-x-4">
            {["favorite", "watchList", "watched"].map((set) => (
              <button
                key={set}
                onClick={() => handleSetDataSet(set, mediaType)}
                className={`px-4 py-2 rounded-full ${
                  dataSet === set
                    ? `${
                        set === "favorite"
                          ? "bg-red-500"
                          : set === "watchList"
                          ? "bg-orange-500"
                          : "bg-pink-600"
                      } text-white`
                    : "bg-gray-700 text-gray-300"
                } hover:bg-${
                  set === "favorite"
                    ? "red"
                    : set === "watchList"
                    ? "orange"
                    : "pink"
                }-600 transition-colors`}
              >
                {set === "favorite"
                  ? "Favorite"
                  : set === "watchList"
                  ? "Watch List"
                  : "Watched"}
              </button>
            ))}
          </div>
        </div>

        <div>
        </div>
        {/* Shows Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8">
        <h2 className="text-center text-4xl sm:text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-[#1a2a6c] via-pink-500 to-[#ff7e5f] mb-12 mx-auto w-min whitespace-nowrap flex items-center">
                {dataSet === "favorite" ? "Favorites" : dataSet === "watchList" ? "Watch List" : "Watched"}
              </h2>
          {data.map((show) => (
            <div
              key={show.id}
              className="relative group rounded-lg overflow-hidden shadow-lg"
            >
              <ShowCard
                show={show}
                type_={show.type}
                type={1}
                user={user}
              />
            </div>
          ))}
        </div>
      </div>

      <Footer />
    </>
  );
};

export default MyListPage;