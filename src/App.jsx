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
      Authorization: import.meta.env.VITE_TMDB_AUTHKEY,
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
        <Route path="/movies" element={<ShowsPage options={options} type_={"movie"}/>} />
        <Route path="/series" element={<ShowsPage options={options} type_={"tv"}/>} />
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
