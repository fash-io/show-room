import { navLinks } from "../constants";
import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaSearch } from "react-icons/fa";
import "react-toastify/dist/ReactToastify.css";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../utils/firebase";

const Navbar = (props) => {
  const { user } = props;
  const { pathname } = useLocation();
  const [photo, setPhoto] = useState("");

  const navRef = useRef();

  const fetchWatchlistData = async () => {
    if (user) {
      try {
        const userDocRef = doc(db, "users", user.uid);
        const userDocSnap = await getDoc(userDocRef);
        setPhoto(userDocSnap.data().photoURL);
      } catch (err) {
        console.error(err);
      }
    }
  };

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "instant",
    });

    fetchWatchlistData();
  }, [pathname]);

  useEffect(() => {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 300) {
        navRef?.current.classList.add("bg-black/50", "backdrop-blur-md");
      } else {
        navRef?.current.classList.remove("bg-black/50", "backdrop-blur-md");
      }
    });
  }, []);

  return (
    <>
      <nav
        ref={navRef}
        className={`w-full fixed py-3 md:py-5 px-[6%] flex justify-between items-center text-[#e5e5e5] z-[998] text-sm duration-300`}
        style={{
          backgroundImage:
            "linear-gradient(180deg, rgba(0,0,0,0.7) 30%, transparent)",
        }}
      >
        {/* Logo and Links Container */}
        <div className="flex items-center gap-12 logo">
          <Link to={"/"}>
            <span className="text-xl sm:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#ff7e5f] via-pink-500 to-[#1a2a6c]">
              ShowRoom
            </span>
          </Link>

          {/* Desktop Links */}
          <ul className="hidden md:flex gap-8">
            {navLinks
              .sort((a, b) => a.index - b.index)
              .map((val, i) => (
                <Link key={i} to={val.href}>
                  <li
                    className={`cursor-pointer text-xs lg:text-base duration-200 bg-clip-text hover:text-transparent bg-gradient-to-r from-[#ff7e5f] via-pink-500 to-[#1a2a6c] ${
                      pathname === val.href ? "text-transparent" : ""
                    }`}
                  >
                    {val.label}
                  </li>
                </Link>
              ))}
          </ul>
        </div>

        {!(pathname === "/profile") && (
          <>
            <div className="flex gap-4 lg:gap-15 items-center">
              {/* Search icon */}
              <Link to={"/search"}>
                <FaSearch className="cursor-pointer" size={20} />
              </Link>
              {user && Object.keys(user).length !== 0 ? (
                <Link
                  to={"/profile"}
                  className="flex items-center relative profile cursor-pointer"
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
          </>
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
              className={`flex flex-col items-center justify-center min-w-[20%] max-w-[20%]`}
            >
              <span
                className={`${
                  pathname === val.href
                    ? "absolute px-[20px] py-[6px] -skew-x-[25deg] bottom-[75%] shadow-lg gg rounded bg-gradient-to-r from-[#ff7e5f] to-[#1a2a6c]"
                    : ""
                }`}
              >
                <i
                  className={`fa-solid ${val.icon} ${
                    pathname === val.href
                      ? "font-bold text-base skew-x-[25deg]"
                      : ""
                  }`}
                ></i>
              </span>
              <li
                className={`cursor-pointer text-[10px] py-2 px-4 whitespace-nowrap`}
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
