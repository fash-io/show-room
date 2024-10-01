import { useEffect, useState } from "react";
import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./utils/firebase";
import { fetchAndSetUserData } from "./utils/firebaseHandlers";
import Loading from "./components/Loading";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import UserContext from "./UserContext";

import {
  Home,
  Login,
  ShowPage,
  PersonPage,
  SearchPage,
  ShowsPage,
  PopularPage,
  Error,
  ProfilePage,
  ContactUs,
  FAQ,
  CollectionPage,
  MyList,
} from "./pages";

const App = () => {
  const [isExploring, setIsExploring] = useState(false);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user_) => {
      if (user_) {
        setUser(user_);
        await fetchAndSetUserData(user_, setUserData);
      } else {
        setUser(null);
        setUserData(null);
      }
      setLoading(false); // Set loading to false after fetching user data
    });
    return () => unsubscribe(); // Cleanup subscription on unmount
  }, []); // Only run on mount

  useEffect(() => {
    if (!loading) {
      if (!isExploring && !user) {
        navigate("/login");
      }
    }
  }, [isExploring, loading, user, navigate]);

  if (loading) {
    return <Loading />;
  }

  return (
    <>
      <UserContext.Provider value={{ user: user, userData: userData }}>
        <ToastContainer className={"toast-container z-[1000]"} />
        {location.pathname !== "/login" && <Navbar />}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/login"
            element={<Login setIsExploring={setIsExploring} />}
          />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/list" element={<MyList />} />
          <Route
            path="/movies"
            element={<ShowsPage setLoading={setLoading} />}
          />
          <Route
            path="/series"
            element={<ShowsPage setLoading={setLoading} />}
          />
          <Route
            path="/trending"
            element={<PopularPage setLoading={setLoading} />}
          />
          <Route
            path="/person/:id"
            element={<PersonPage setLoading={setLoading} />}
          />
          <Route
            path="/collection/:id"
            element={<CollectionPage setLoading={setLoading} />}
          />
          <Route
            path="/:type/:id"
            element={<ShowPage setLoading={setLoading} />}
          />
          <Route
            path="/search/:searchQuery"
            element={<SearchPage />}
          />
          <Route
            path="/search"
            element={<SearchPage />}
          />
          <Route path="/contact-us" element={<ContactUs />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="*" element={<Error />} />
        </Routes>
        {location.pathname !== "/login" && <Footer />}
      </UserContext.Provider>
    </>
  );
};

export default App;
