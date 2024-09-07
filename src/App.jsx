import { useEffect, useState } from "react";
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
} from "./pages";
import { Routes, Route, useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./utils/firebase";
import { logout } from "./utils/firebase";
import MyListPage from "./pages/MyList";

const App = () => {
  const navigate = useNavigate();
  const [isExploring, setIsExploring] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user_) => {
      if (user_) {
        setUser(user_);
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization:
      "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIyOTk4YjQyMDliOGZjYWJiMGY5NmRkYTU3ZDlhZjI5ZiIsIm5iZiI6MTcyNDk1OTg0Ni44NjEzMTksInN1YiI6IjY2ZDBjYWUwNDYxZTRjNDg4N2IxMzVkMSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.8QXxSpY5y4m-sXdD9Qp0TuBfbdUjUiSvTHL_rY0mP4A",
    },
  };
  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <>
      <ToastContainer />
      <Routes>
        <Route
          path="/"
          element={
            isExploring || user ? <Home options={options} /> : <Login setIsExploring={setIsExploring} />
          }
        />
        <Route path="/login" element={<Login setIsExploring={setIsExploring}/>} />
        <Route
          path="/movies"
          element={<ShowsPage options={options} type_={"movie"} />}
        />
        <Route
          path="/series"
          element={<ShowsPage options={options} type_={"tv"} />}
        />
        <Route path="/trending" element={<PopularPage options={options} />} />
        <Route path="/person/:id" element={<PersonPage options={options} />} />
        <Route path="/:type/:id" element={<ShowPage options={options} />} />
        <Route path="/search" element={<SearchPage options={options} />} />
        <Route path="/profile" element={user ? <ProfilePage /> : <Login />} />
        <Route path="/contact-us" element={<ContactUs />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/list" element={<MyListPage />} />
        <Route path="*" element={<Error />} />
      </Routes>
    </>
  );
};

export default App;
