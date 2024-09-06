import Navbar from "../components/Navbar";
import Loading from "../components/Loading";
import TitleCards from "../components/TitleCards";
import Footer from "../components/Footer";
import Slider from "../components/Slider";
import Error from "../components/Error";
import { useState } from "react";

const Home = (props) => {
  const { options } = props;
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
      <Navbar />
      <Slider height="max-h-[95vh] max-sm:min-h-[60vh]" setLoading={setLoading} setError={setError} type={"all"} options={options} />
      <div className="p-2 sm:px-10 gradient">
        <TitleCards title="Popular Movies" category="popular" options={options} type={"movie"}/>
        <TitleCards title="Top Rated Movies" category="top_rated" options={options} type={"movie"}/>
        <TitleCards title="Upcoming Movies" category="upcoming" options={options} type={"movie"}/>
        <TitleCards title="Popular Series" category="popular" options={options} type={"tv"}/>
        <TitleCards title="Top Rated Series" category="top_rated" options={options} type={"tv"}/>
        <TitleCards title="On The Air" category="on_the_air" options={options} type={"tv"}/>
      </div>
      <Footer />
    </>
  );
};

export default Home;
