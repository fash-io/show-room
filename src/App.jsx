import React, { useEffect } from "react";
import {
  Home,
  Login,
  ShowPage,
  PersonPage,
  SearchPage,
  ShowsPage,
  PopularPage,
  Error,
} from "./pages";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./utils/firebase";
import { ToastContainer } from "react-toastify";
import ProfilePage from "./pages/ProfilePage";

const App = () => {
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization:
        "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIyOTk4YjQyMDliOGZjYWJiMGY5NmRkYTU3ZDlhZjI5ZiIsIm5iZiI6MTcyNDk1OTg0Ni44NjEzMTksInN1YiI6IjY2ZDBjYWUwNDYxZTRjNDg4N2IxMzVkMSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.8QXxSpY5y4m-sXdD9Qp0TuBfbdUjUiSvTHL_rY0mP4A",
    },
  };

  const navigate = useNavigate();
  const path = useLocation().pathname;

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        navigate(path);
      } else {
        navigate("/login");
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  return (
    <>
      <ToastContainer />
      <Routes>
        <Route path="/" element={<Home options={options} />} />
        <Route path="/login" element={<Login />} />
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
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="*" element={<Error />} />
      </Routes>
    </>
  );
};

export default App;
