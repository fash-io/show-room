import { toast } from "react-toastify";
import { logout, storeFavorite, storeWatched, storeWatchList } from "./firebase";
import { useNavigate } from "react-router-dom";

const handleAddToWatchList = async (showId, showType, user) => {
  if (user) {
    try {
      await storeWatchList(user.uid, { id: showId, type: showType });
    } catch (error) {
      console.error("Error adding to watch list:", error.message);
      toast.error(`Error adding to watch list: ${error.message}`);
    }
  } else {
    toast.error("You need to create an account");
  }
};

const handleAddToFavorites = async (showId, showType, user) => {
  if (user) {
    try {
      await storeFavorite(user.uid, { id: showId, type: showType });
    } catch (error) {
      console.error("Error adding to favorites:", error.message);
      toast.error(`Error adding to favorites: ${error.message}`);
    }
  } else {
    toast.error("You need to create an account");
  }
};

const handleAddToWatched = async (showId, showType, user) => {
  if (user) {
    try {
      await storeWatched(user.uid, { id: showId, type: showType });
    } catch (error) {
      console.error("Error adding to watched shows:", error.message);
      toast.error(`Error adding to watched shows: ${error.message}`);
    }
  } else {
    toast.error("You need to create an account");
  }
};

const handleLogout = async () => {
  try {
    await logout();
    window.location.href = "/login"; // Corrected redirect
  } catch (error) {
    console.error("Error logging out:", error.message);
    toast.error(`Error logging out: ${error.message}`);
  }
};

export { handleAddToWatchList, handleAddToFavorites, handleAddToWatched, handleLogout };
