import { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./utils/firebase";
import MyListPage from "./pages/MyList";
import Loading from "./components/Loading";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
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
} from "./pages";

const apiOptions = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: import.meta.env.VITE_API_KEY,
  },
};
const App = () => {
  const [isExploring, setIsExploring] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // New loading state

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user_) => {
      if (user_) {
        setUser(user_);
      } else {
        setUser(null);
      }
      setLoading(false); // Set loading to false after Firebase check
    });

    return () => unsubscribe();
  }, [auth]);

  if (loading) {
    return <Loading />; // Show a loading spinner or message while checking auth
  }

  return (
    <>
    <Navbar user={user} options={apiOptions} />
      <ToastContainer className={"toast-container z-[1000]"} />
      <Routes>
        {/* Home Route */}
        <Route
          path="/"
          element={
            isExploring || user ? (
              <Home options={apiOptions} user={user} />
            ) : (
              <Login setIsExploring={setIsExploring} />
            )
          }
        />

        {/* Auth Routes */}
        <Route
          path="/login"
          element={<Login setIsExploring={setIsExploring} />}
        />
        <Route
          path="/profile"
          element={
            user ? <ProfilePage /> : <Login setIsExploring={setIsExploring} />
          }
        />
        <Route
          path="/list"
          element={<MyListPage user={user} options={apiOptions} />}
        />

        {/* Show and Movie Routes */}
        <Route
          path="/movies"
          element={
            <ShowsPage options={apiOptions} type_={"movie"} user={user} />
          }
        />
        <Route
          path="/series"
          element={<ShowsPage options={apiOptions} type_={"tv"} user={user} />}
        />
        <Route
          path="/trending"
          element={<PopularPage options={apiOptions} user={user} />}
        />
        <Route
          path="/person/:id"
          element={<PersonPage options={apiOptions} user={user} />}
        />
        <Route
          path="/collection/:id"
          element={<CollectionPage options={apiOptions} user={user} />}
        />

        <Route
          path="/:type/:id"
          element={<ShowPage options={apiOptions} user={user} />}
        />

        {/* 404 Route */}
        <Route path="/404" element={<Error error={"mad"} />} />

        {/* Misc Routes */}
        <Route
          path="/search"
          element={<SearchPage options={apiOptions} user={user} />}
        />
        <Route path="/contact-us" element={<ContactUs user={user} />} />
        <Route path="/faq" element={<FAQ user={user} />} />
        <Route path="*" element={<Error />} />
      </Routes>
      <Footer />
    </>
  );
};

export default App;
