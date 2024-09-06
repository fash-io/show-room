import React, { useState, useEffect } from 'react';
import { db, auth } from '../utils/firebase'; // Import your Firebase configuration
import { doc, getDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import Loading from "../components/Loading";

const ProfilePage = () => {
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async (uid) => {
      setIsLoading(true); // Set loading state to true
      try {
        const userDocRef = doc(db, "users", uid);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          setUserData(userDocSnap.data());
        } else {
          console.log("No such document with UID:", uid);
          setError("No user data found.");
        }
      } catch (error) {
        console.error("Error fetching user data:", error.message);
        setError("Error fetching user data.");
      } finally {
        setIsLoading(false); // Set loading state to false after fetching
      }
    };

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchUserData(user.uid);
      } else {
        setUserData(null);
        setIsLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return <div className="p-8 min-h-screen flex justify-center items-center text-white">
      <p>{error}</p>
    </div>;
  }

  if (userData === null) {
    return <div className="p-8 min-h-screen flex justify-center items-center text-white">
      <p>No user data available.</p>
    </div>;
  }

  return (
    <div className="p-8 min-h-screen flex justify-center items-center">
      <div className="max-w-2xl w-full bg-slate-800 shadow-lg rounded-lg p-8">
        <div className="flex flex-col items-center">
          {userData.photoURL ? (
            <img
              src={userData.photoURL}
              alt="Profile"
              className="rounded-full w-32 h-32 object-cover shadow-md"
            />
          ) : (
            <i className='fa fa-user w-32 h-32 shadow-md'></i>
          )}
          <h2 className="mt-4 text-2xl font-semibold text-gray-100">
            {userData.name}
          </h2>
          <p
            className={`mt-1 text-sm font-medium ${
              userData.emailVerified ? "text-green-500" : "text-red-500"
            }`}
          >
            {userData.emailVerified ? "Email Verified" : "Email Not Verified"}
          </p>
        </div>

        {/* Profile Information Display */}
        <div className="mt-6 space-y-4">
          <div>
            <p className="text-gray-400 text-sm">Email:</p>
            <p className="text-gray-100 font-medium">{userData.email || "N/A"}</p>
          </div>
          <div>
            <p className="text-gray-400 text-sm">Phone:</p>
            <p className="text-gray-100 font-medium">{userData.phoneNumber || "N/A"}</p>
          </div>
          <div>
            <p className="text-gray-400 text-sm">Address:</p>
            <p className="text-gray-100 font-medium">
              {userData.address ? `${userData.address.street}, ${userData.address.city}, ${userData.address.state}, ${userData.address.zip}, ${userData.address.country}` : "N/A"}
            </p>
          </div>
          <div>
            <p className="text-gray-400 text-sm">Bio:</p>
            <p className="text-gray-100 font-medium">{userData.additionalInfo ? userData.additionalInfo.bio : "N/A"}</p>
          </div>
          <div>
            <p className="text-gray-400 text-sm">Hobbies:</p>
            <p className="text-gray-100 font-medium">
              {userData.additionalInfo ? userData.additionalInfo.hobbies.join(", ") : "N/A"}
            </p>
          </div>
          <div>
            <p className="text-gray-400 text-sm">Member Since:</p>
            <p className="text-gray-100 font-medium">
              {userData.createdAt ? new Date(userData.createdAt).toLocaleDateString() : "N/A"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
