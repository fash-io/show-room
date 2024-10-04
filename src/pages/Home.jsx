import TitleCards from "../components/TitleCards";
import Slider from "../components/Slider";
import Error from "../components/Error";
import { useContext, useState } from "react";
import UserContext from "../UserContext";
import Loading from "../components/Loading";

const Home = () => {
  const [error, setError] = useState("");
  const { user } = useContext(UserContext);
  const [loading, setLoading] = useState(false);

  if (error) {
    return <Error error={error} />;
  }
  return (
    <>
      {loading && <Loading transparent={true} />}
      <Slider
        height="max-h-[70vh]  max-sm:min-h-[60vh]"
        type={"all"}
        setLoading={setLoading}
        setError={setError}
      />
      <div className="pl-2 pr-1 sm:pl-10 ">
        <TitleCards title="Popular Movies" category="popular" type="movie" />
        <TitleCards
          title="Top Rated Movies"
          category="top_rated"
          type="movie"
        />
        <TitleCards title="Upcoming Movies" category="upcoming" type="movie" />
        <TitleCards title="Popular Series" category="popular" type="tv" />
        <TitleCards title="Top Rated Series" category="top_rated" type="tv" />
        <TitleCards title="On The Air" category="on_the_air" type="tv" />
        {user && <TitleCards title="Your Watch List" userWatchlist={true} />}
      </div>
    </>
  );
};

export default Home;
