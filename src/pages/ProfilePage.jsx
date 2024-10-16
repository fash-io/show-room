import { useState, useEffect } from "react";
import { db, auth, storage } from "../utils/firebase"; 
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import Error from "../components/Error";
import { handleLogout } from "../utils/firebaseHandlers";
import GoBackButton from "../components/GoBackButton";
import { useNavigate } from "react-router-dom";

const ProfilePage = () => {
  const navigator = useNavigate();
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false); 

  useEffect(() => {
    const fetchUserData = async (uid) => {
      try {
        const userDocRef = doc(db, "users", uid);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          setUserData(userDocSnap.data());
          setFormData(userDocSnap.data());
        } else {
          setError("No user data found.");
        }
      } catch (error) {
        setError("Error fetching user data.");
      } 
    };

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchUserData(user.uid);
      } else {
        setUserData(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let photoURL = userData.photoURL;

      if (file) {
        setIsUploading(true); 
        const storageRef = ref(
          storage,
          `profileImages/${auth.currentUser.uid}/${file.name}`
        );
        await uploadBytes(storageRef, file);
        photoURL = await getDownloadURL(storageRef);
        setIsUploading(false); 
      }

      const userDocRef = doc(db, "users", auth.currentUser.uid);
      const updateData = {
        ...formData,
        ...(photoURL && { photoURL }),
      };

      await updateDoc(userDocRef, updateData);
      setUserData({ ...formData, photoURL });
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating user data:", error.message);
      setError(`Error updating user data: ${error.message}`);
    }
  };

  const handle_Logout = () => {
    handleLogout();
    navigator("/");
  };

  if (error) {
    return <Error error={error} />;
  }

  if (userData === null) {
    return (
      <div className="p-8 min-h-screen flex justify-center items-center bg-gray-900 text-white">
        <p className="text-lg">No user data available.</p>
      </div>
    );
  }

  return (
    <>
      <GoBackButton />
      <div className="bg-gradient-to-r from-gray-800 via-gray-900 to-black min-h-screen flex items-center justify-center flex-col">
        <div className="sm:bg-gray-900/80 text-white rounded-lg sm:shadow-xl max-w-3xl w-full p-8">
          <div className="flex flex-col items-center">
            {userData.photoURL ? (
              <img
                src={userData.photoURL}
                alt="Profile"
                className="rounded-full w-40 h-40 object-cover shadow-lg"
              />
            ) : (
              <div className="w-40 h-40 bg-gray-700 rounded-full flex items-center justify-center text-white text-4xl shadow-lg">
                <i className="fa fa-user"></i>
              </div>
            )}
            <h2 className="mt-4 text-3xl font-bold">{userData.name}</h2>
            <button
              onClick={handleEditToggle}
              className="mt-4 px-6 py-3 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
            >
              {isEditing ? "Cancel" : "Edit"}
            </button>
          </div>

          {isEditing && (
            <form onSubmit={handleSubmit} className="mt-6 space-y-6">
              <div>
                <label className="block text-sm text-gray-400">Name:</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name || ""}
                  onChange={handleChange}
                  className="w-full p-3 mt-1 bg-gray-700 rounded-lg text-white"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400">Phone:</label>
                <input
                  type="text"
                  name="phoneNumber"
                  value={formData.phoneNumber || ""}
                  onChange={handleChange}
                  className="w-full p-3 mt-1 bg-gray-700 rounded-lg text-white"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400">Address:</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address || ""}
                  onChange={handleChange}
                  className="w-full p-3 mt-1 bg-gray-700 rounded-lg text-white"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400">Bio:</label>
                <textarea
                  name="bio"
                  value={formData.bio || ""}
                  onChange={handleChange}
                  className="w-full p-3 mt-1 bg-gray-700 rounded-lg text-white"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400">Hobbies:</label>
                <input
                  type="text"
                  name="hobbies"
                  value={formData.additionalInfo?.hobbies.join(", ") || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      additionalInfo: {
                        ...formData.additionalInfo,
                        hobbies: e.target.value
                          .split(",")
                          .map((hobby) => hobby.trim()),
                      },
                    })
                  }
                  className="w-full p-3 mt-1 bg-gray-700 rounded-lg text-white"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400">
                  Profile Image:
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="w-full mt-1"
                />
              </div>
              <button
                type="submit"
                className="px-6 py-3 bg-green-600 text-white rounded-lg shadow hover:bg-green-700 transition"
                disabled={isUploading}
              >
                {isUploading ? "Uploading..." : "Save Changes"}
              </button>
            </form>
          )}

          <button
            onClick={handle_Logout}
            className="mt-4 text-red-500 underline"
          >
            Logout
          </button>
        </div>
      </div>
    </>
  );
};

export default ProfilePage;
