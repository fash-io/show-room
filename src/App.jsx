import { useEffect, useState } from "react";
import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
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
    Authorization:
      "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIyOTk4YjQyMDliOGZjYWJiMGY5NmRkYTU3ZDlhZjI5ZiIsIm5iZiI6MTcyNDk1OTg0Ni44NjEzMTksInN1YiI6IjY2ZDBjYWUwNDYxZTRjNDg4N2IxMzVkMSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.8QXxSpY5y4m-sXdD9Qp0TuBfbdUjUiSvTHL_rY0mP4A",
  },
};

const App = () => {
  const [isExploring, setIsExploring] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // New loading state
  const location = useLocation(); // Get the current pathname
  const navigate = useNavigate();

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
  }, []);

  useEffect(() => {
    // Redirect based on user authentication and exploration state
    if (!loading) {
      if (!isExploring && !user && location.pathname === "/") {
        navigate("/login");
      }
    }
  }, [isExploring, user, loading, navigate, location.pathname]);

  if (loading) {
    return <Loading />; // Show a loading spinner or message while checking auth
  }

  const showNavbarPaths = [
    "/",
    "/movies",
    "/profile",
    "/list",
    "/series",
    "/faq",
    "/contact",
    "/search",
    "/collection/:id",
    "/trending",
    "/person/:id",
    "/movie",
    "/:type/:id",
  ];

  // Check if the path should show the Navbar, including dynamic movie/series routes
  const isNavbarVisible =
    showNavbarPaths.includes(location.pathname) ||
    /^\/(movie|series|person|collection)\/\d+$/.test(location.pathname);

  return (
    <>
      {/* Conditionally render Navbar */}
      {isNavbarVisible && <Navbar user={user} options={apiOptions} />}
      <ToastContainer className={"toast-container z-[1000]"} />
      <Routes>
        {/* Home Route */}
        <Route path="/" element={<Home options={apiOptions} user={user} />} />

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
        <Route
          path="/movies"
          element={<ShowsPage options={apiOptions} type_={"movie"} />}
        />
        <Route
          path="/series"
          element={<ShowsPage options={apiOptions} type_={"tv"} />}
        />
        <Route
          path="/trending"
          element={<PopularPage options={apiOptions} />}
        />
        <Route
          path="/person/:id"
          element={<PersonPage options={apiOptions} />}
        />
        <Route
          path="/collection/:id"
          element={<CollectionPage options={apiOptions} />}
        />
        <Route path="/:type/:id" element={<ShowPage options={apiOptions} />} />
        <Route path="/search" element={<SearchPage options={apiOptions} />} />
        <Route path="/contact-us" element={<ContactUs />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="*" element={<Error />} />
      </Routes>
      {isNavbarVisible && <Footer />}
    </>
  );
};

export default App;
