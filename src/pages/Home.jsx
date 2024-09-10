import Navbar from "../components/Navbar";
import Loading from "../components/Loading";
import TitleCards from "../components/TitleCards";
import Slider from "../components/Slider";
import Error from "../components/Error";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Home = (props) => {
  const { options, user } = props;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <Error error={error} />;
  }

  return (
    <>
      <Slider height="max-h-[95vh] max-sm:min-h-[60vh]" type={"all"} options={options} setLoading={setLoading} setError={setError}/>
      <div className="p-2 sm:px-10">
        <TitleCards title="Popular Movies" category="popular" options={options} type={"movie"} user={user}/>
        <TitleCards title="Top Rated Movies" category="top_rated" options={options} type={"movie"} user={user}/>
        <TitleCards title="Upcoming Movies" category="upcoming" options={options} type={"movie"} user={user}/>
        <TitleCards title="Popular Series" category="popular" options={options} type={"tv"} user={user}/>
        <TitleCards title="Top Rated Series" category="top_rated" options={options} type={"tv"} user={user}/>
        <TitleCards title="On The Air" category="on_the_air" options={options} type={"tv"} user={user}/>
        {user && <TitleCards title="Your Watch List" userWatchlist={true} options={options} user={user}/>}
      </div>
    </>
  );
};

export default Home;
