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
import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
const App = () => {
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization:
        "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIyOTk4YjQyMDliOGZjYWJiMGY5NmRkYTU3ZDlhZjI5ZiIsIm5iZiI6MTcyNDk1OTg0Ni44NjEzMTksInN1YiI6IjY2ZDBjYWUwNDYxZTRjNDg4N2IxMzVkMSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.8QXxSpY5y4m-sXdD9Qp0TuBfbdUjUiSvTHL_rY0mP4A",
    },
  };

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
        <Route path="/contact-us" element={<ContactUs />} />{" "}
        {/* Add new route */}
        <Route path="/faq" element={<FAQ />} /> {/* Add new route */}
        <Route path="*" element={<Error />} />
      </Routes>
    </>
  );
};

export default App;
