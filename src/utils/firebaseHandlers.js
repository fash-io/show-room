import { toast } from "react-toastify";
import { db, logout, storeFavorite, storeWatched, storeWatchList } from "./firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

const updateUserDocument = async (user, updateFn, type) => {
  try {
    const userDocRef = doc(db, "users", user.uid);
    const userDoc = await getDoc(userDocRef);

    if (!userDoc.exists()) {
      console.error("User document not found");
      return;
    }

    const items = userDoc.data()[type] || [];
    const updatedItems = updateFn(items);

    if (updatedItems.length === items.length) {
      toast.error(`Item not found in ${type}`);
      return;
    }

    await setDoc(userDocRef, { [type]: updatedItems }, { merge: true });
    toast.info(`Item removed from ${type}`);
  } catch (error) {
    console.error(`Error updating ${type}:`, error.message);
    toast.error(`Error updating ${type}: ${error.message}`);
  }
};

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
    window.location.href = "/login";
  } catch (error) {
    console.error("Error logging out:", error.message);
    toast.error(`Error logging out: ${error.message}`);
  }
};

const handleRemoveFavoriteItem = async (showId, showType, user) => {
  if (user) {
    await updateUserDocument(user, (items) =>
      items.filter((item) => item.id !== showId || item.type !== showType), 
      "favorite"
    );
  } else {
    toast.error("You need to create an account");
  }
};

const handleRemoveWatchListItem = async (showId, showType, user) => {
  if (user) {
    await updateUserDocument(user, (items) =>
      items.filter((item) => item.id !== showId || item.type !== showType), 
      "watchList"
    );
  } else {
    toast.error("You need to create an account");
  }
};

const handleRemoveWatchedItem = async (showId, showType, user) => {
  if (user) {
    await updateUserDocument(user, (items) =>
      items.filter((item) => item.id !== showId || item.type !== showType), 
      "watched"
    );
  } else {
    toast.error("You need to create an account");
  }
};

export const fetchFavorites = async (user) => {
  try {
    const userDocRef = doc(db, "users", user.uid);
    const userDoc = await getDoc(userDocRef);

    if (!userDoc.exists()) {
      console.error("User document not found");
      return;
    }
    return userDoc.data().favorite;
  } catch (error) {
    console.error("Error fetching user document:", error);
  }
};
export const fetchWatchList = async (user) => {
  try {
    const userDocRef = doc(db, "users", user.uid);
    const userDoc = await getDoc(userDocRef);

    if (!userDoc.exists()) {
      console.error("User document not found");
      return;
    }
    return userDoc.data().watchList;
  } catch (error) {
    console.error("Error fetching user document:", error);
  }
};
export const fetchWatched = async (user) => {
  try {
    const userDocRef = doc(db, "users", user.uid);
    const userDoc = await getDoc(userDocRef);

    if (!userDoc.exists()) {
      console.error("User document not found");
      return;
    }
    return userDoc.data().watched;
  } catch (error) {
    console.error("Error fetching user document:", error);
  }
};

export { handleAddToWatchList, handleAddToFavorites, handleAddToWatched, handleLogout, handleRemoveFavoriteItem, handleRemoveWatchListItem, handleRemoveWatchedItem };
