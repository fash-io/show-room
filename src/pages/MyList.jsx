import { useContext, useEffect, useState } from "react";
import ShowCard from "../components/ShowCard";
import Error from "../components/Error";
import { fetchWatchlistData, options } from "../utils/api";
import UserContext from "../UserContext";

const MyListPage = () => {
  const { user, userData } = useContext(UserContext);
  const [favorites, setFavorites] = useState([]);
  const [watchList, setWatchlist] = useState([]);
  const [watched, setWatched] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState([]);
  const [dataSet, setDataSet] = useState("watchList");
  const [mediaType, setMediaType] = useState("all");

  useEffect(() => {
    fetchWatchlistData(
      setLoading,
      setError,
      setFavorites,
      setWatchlist,
      setWatched,
      userData,
      user
    );

    fetchWatchlistData();
  }, [options, user]);

  useEffect(() => {
    handleSetDataSet(dataSet, mediaType);
  }, [favorites, watchList, watched, dataSet, mediaType]);

  const handleSetDataSet = (set, type) => {
    setDataSet(set);
    setMediaType(type);
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
      const mediaTypeKey = type === "movie" ? "movie" : "series";
      filteredData = filteredData.filter((item) => item.type === mediaTypeKey);
    }
    setData(filteredData);
  };

  if (!user) {
    return (
      <>
        <div className="h-[100vh] flex items-center justify-center">
          <Error error={"Not Logged In"} />
        </div>
      </>
    );
  }

  if (error) {
    return <Error error={error} />;
  }

  return (
    <>
      {loading && (
        <div className="fixed min-h-screen w-full bg-black/70 flex justify-center items-center z-10">
          <p className="text-xl font-semibold">Loading</p>
          <p className={`spans`}>
            <span>.</span>
            <span>.</span>
            <span>.</span>
          </p>
        </div>
      )}
      <div className="min-h-screen text-white py-20 px-4 sm:px-8 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center justify-between mb-10 space-y-4 lg:space-y-0 sm:px-20">
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

          <div className="flex flex-wrap items-center space-x-2">
            {["watchList", "favorite", "watched"].map((set) => (
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
                {set === "watchList"
                  ? "Watch List"
                  : set === "favorite"
                  ? "Favorite"
                  : "Watched"}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8">
          <h2 className="text-center text-4xl sm:text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-[#1a2a6c] via-pink-500 to-[#ff7e5f] mb-12 mx-auto w-min whitespace-nowrap flex items-center">
            {dataSet === "favorite"
              ? "Favorites"
              : dataSet === "watchList"
              ? "Watch List"
              : "Watched"}
          </h2>
          {data.length === 0 ? (
            <p className="text-center text-gray-400 col-span-full">
              No items found.
            </p>
          ) : (
            data.map((show) => (
              <div
                key={show.id}
                className="relative group rounded-lg overflow-hidden shadow-lg"
              >
                <ShowCard show={show} type_={show.type} type={1} user={user} />
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default MyListPage;
