import { toast } from "react-toastify";
import { db, logout, storeItem } from "./firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

const fetchUserData = async (user) => {
  if (user) {
    try {
      const userDocRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userDocRef);

      if (!userDoc.exists()) {
        console.error("User document not found");
        return null;
      }

      return userDoc.data(); 
    } catch (error) {
      console.error("Error fetching user document:", error);
      toast.error(`Error fetching user data: ${error.message}`);
    }
  } else {
    toast.error("You need to create an account");
  }
  return null;
};

const handleAddItem = async (showId, showType, user, type) => {
  if (user) {
    try {
      await storeItem(user.uid, { id: showId, type: showType }, type);
      toast.info(`Added to ${type}`);
    } catch (error) {
      console.error(`Error adding to ${type} shows:`, error.message);
      toast.error(`Error adding to ${type} shows: ${error.message}`);
    }
  } else {
    toast.error("You need to create an account");
  }
};

const updateUserDocument = async (user, updateFn, type) => {
  if (user) {
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
  } else {
    toast.error("You need to create an account");
  }
};

const handleRemoveItem = async (showId, showType, user, type) => {
  await updateUserDocument(
    user,
    (items) =>
      items.filter((item) => item.id !== showId || item.type !== showType),
    type
  );
};

const handleLogout = async () => {
  try {
    await logout();
    toast.info("Logged out");
  } catch (error) {
    console.error("Error logging out:", error.message);
    toast.error(`Error logging out: ${error.message}`);
  }
};

export { handleAddItem, handleRemoveItem, fetchUserData, handleLogout };
