import { navLinks } from "../constants";
import { useContext, useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaSearch } from "react-icons/fa";
import UserContext from "../UserContext";
import { options } from "../utils/api";
import { useOnClickOutside } from "../useOnClickOutside";
import "react-toastify/dist/ReactToastify.css";

const Navbar = () => {
  const { userData } = useContext(UserContext);
  const [photo, setPhoto] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const [searchIcon, setSearchIcon] = useState(false);
  const [results, setResults] = useState([]);
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const searchRef = useRef();
  const IconRef = useRef();
  const resultRef = useRef();
  const navRef = useRef();

  const searchMovies = async () => {
    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/search/multi?query=${encodeURIComponent(
          searchValue
        )}&include_adult=false&page=1`,
        options
      );
      const data = await response.json();
      setResults(data.results || []);
    } catch (err) {
      console.log("Error fetching search results:", err);
    }
  };

  useEffect(() => {
    if (searchValue) searchMovies();
  }, [searchValue]);

  useEffect(() => {
    if (userData) {
      setPhoto(userData?.photoURL);
    }
  }, [userData]);

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "instant",
    });
  }, [pathname]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        navRef.current.classList.add("bg-black/50", "backdrop-blur-md");
      } else {
        navRef.current.classList.remove("bg-black/50", "backdrop-blur-md");
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleClickOutside = function () {
    setSearchValue("");
    setResults([]);
    setSearchIcon(false);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchValue) {
      navigate(`/search/${searchValue}`);
      setSearchValue("");
      setResults([]);
      setSearchIcon(false);
    }
  };

  const handleResultClick = (media_type, id) => {
    navigate(`/${media_type}/${id}`);
    setSearchValue("");
    setResults([]);
    setSearchIcon(false);
  };

  useOnClickOutside(searchRef, handleClickOutside);

  return (
    <>
      <nav
        ref={navRef}
        className="w-full fixed py-3 md:py-5 px-[6%] flex justify-between items-center text-white z-[998] text-sm duration-300 bg-transparent"
        style={{
          backgroundImage:
            "linear-gradient(180deg, rgba(0,0,0,0.7) 30%, transparent)",
        }}
      >
        <div className="flex items-center gap-12">
          <Link to={"/"}>
            <span
              className={`sm:text-4xl font-bold bg-clip-text text-transparent duration-300 bg-gradient-to-r from-[#ff7e5f] via-pink-500 to-[#1a2a6c] ${
                searchIcon ? "text-xs" : "text-xl"
              }`}
            >
              ShowRoom
            </span>
          </Link>

          <ul className="hidden md:flex gap-8">
            {navLinks
              .sort((a, b) => a.index - b.index)
              .map((val, i) => (
                <Link key={i} to={val.href}>
                  <li
                    className={`cursor-pointer text-xs lg:text-base duration-200 bg-clip-text hover:text-transparent bg-gradient-to-r from-[#ff7e5f] via-pink-500 to-[#1a2a6c] ${
                      pathname === val.href ? "text-transparent active" : ""
                    }`}
                  >
                    {val.label}
                  </li>
                </Link>
              ))}
          </ul>
        </div>

        {!(pathname === "/profile") && (
          <div className=" flex gap-4 lg:gap-15 items-center">
            <form
              onSubmit={handleSearchSubmit}
              className="flex group duration-150 gap-1 items-center relative"
              ref={searchRef}
            >
              <input
                type="text"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                onFocus={() => setSearchIcon(true)}
                className={`outline-none border-none w-0 group-focus-within:w-[180px] sm:group-focus-within:w-[250px] duration-300 ease-in-out transform rounded-full bg-transparent focus:bg-white/80 px-2 py-[6px] focus:ring-2  text-black placeholder-transparent group-focus-within:placeholder-gray-500`}
                placeholder="Search..."
                ref={IconRef}
                style={{ fontSize: "16px" }}
              />

              <button type="submit" className="relative">
                {searchIcon ? (
                  <i
                    className="fa-solid fa-xmark text-black cursor-pointer absolute top-[50%] translate-y-[-50%] right-3 duration-200 transform hover:scale-125"
                    onClick={() => {
                      setSearchValue("");
                      setResults([]);
                      setSearchIcon(false);
                    }}
                  ></i>
                ) : (
                  <FaSearch
                    className="cursor-pointer absolute top-[50%] translate-y-[-50%] right-3 duration-200 transform hover:scale-125"
                    onClick={() => {
                      searchRef.current.focus();
                      IconRef.current.focus();
                      setSearchIcon(true);
                    }}
                  />
                )}
              </button>

              {results.length > 0 && searchIcon && (
                <div className="absolute top-10 min-w-[300px] -left-14 sm:left-0 max-h-96 w-full bg-black/80 overflow-y-auto rounded-lg">
                  {results.map((val, i) => (
                    <Link
                      className="w-full p-2 flex justify-between items-center hover:bg-gray-700 cursor-pointer"
                      key={i}
                      onClick={() => handleResultClick(val.media_type, val.id)}
                      to={`/${
                        val.media_type === "tv" ? "series" : val.media_type
                      }/${val.id}`}
                    >
                      <div className="flex flex-col mr-5">
                        <span className="font-semibold">
                          {val.name || val.title}
                        </span>
                        <span className="text-sm text-gray-400">
                          {val.media_type === "tv"
                            ? "Series"
                            : val.media_type === "movie"
                            ? "Movie"
                            : "Person"}
                        </span>
                      </div>
                      {val.poster_path || val.profile_path ? (
                        <img
                          src={`https://image.tmdb.org/t/p/w200${
                            val.poster_path || val.profile_path
                          }`}
                          alt={val.name || val.title}
                          className="w-10 h-10 object-cover rounded-lg"
                        />
                      ) : (
                        "N/A"
                      )}
                    </Link>
                  ))}
                </div>
              )}
            </form>

            {userData && Object.keys(userData).length !== 0 ? (
              <Link
                to={"/profile"}
                className=" flex items-center profile cursor-pointer"
              >
                {photo ? (
                  <img
                    src={photo}
                    alt="Profile"
                    className="w-9 h-9 rounded-full object-cover"
                  />
                ) : (
                  <i className="fa-solid fa-user"></i>
                )}
              </Link>
            ) : (
              <Link to={"/login"} className="text-white">
                Login
              </Link>
            )}
          </div>
        )}
      </nav>

      <ul
        className={
          "fixed bottom-0 right-0 left-0 bg-[#191919] flex text-[8px] gap-4 items-center justify-center p-3 px-12 md:hidden z-[999] "
        }
      >
        {navLinks
          .sort((a, b) => a.order - b.order)
          .map((val, i) => (
            <Link
              key={i}
              to={val.href}
              className={`flex flex-col items-center justify-center min-w-[21%] max-w-[21%] duration-300`}
            >
              <span
                className={`${
                  pathname === val.href
                    ? "absolute px-[20px] py-[3px] -skew-x-[25deg] bottom-[75%] shadow-lg gg rounded bg-gradient-to-r from-[#ff7e5f] to-[#1a2a6c]"
                    : ""
                }`}
              >
                <i
                  className={`fa-solid ${val.icon} ${
                    pathname === val.href
                      ? "font-bold skew-x-[25deg] text-sm"
                      : ""
                  }`}
                ></i>
              </span>
              <li
                className={`cursor-pointer text-[8px] pt-[4px] whitespace-nowrap`}
              >
                {val.label}
              </li>
            </Link>
          ))}
      </ul>
    </>
  );
};

export default Navbar;
