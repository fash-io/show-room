import { navLinks } from "../constants";
import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaSearch, FaBell, FaCaretDown, FaBars, FaTimes } from "react-icons/fa"; // Import free icons
import { logout } from "../utils/firebase";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../utils/firebase";

const Navbar = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({});

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user_) => {
      if (user_) {
        setUser(user_);
      } else {
        setUser({});
      }
    });

    return () => unsubscribe(); // Cleanup on unmount
  }, [navigate]);

  const { pathname } = useLocation();

  const navRef = useRef();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "instant",
    });
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

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <>
      <nav
        ref={navRef}
        className={`w-full fixed py-5 px-[6%] flex justify-between items-center text-[#e5e5e5] z-50 text-sm duration-300 ${
          pathname === "/login" ? "hidden" : ""
        }`}
        style={{
          backgroundImage:
            "linear-gradient(180deg, rgba(0,0,0,0.7) 30%, transparent)",
        }}
      >
        {/* Logo and Links Container */}
        <div className="flex items-center gap-12 logo">
          <Link to={"/"}>
            <span
              className="text-xl sm:text-4xl font-bold bg-clip-text text-transparent"
              style={{
                backgroundImage: "linear-gradient(to right, #ff7e5f, #1a2a6c)",
              }}
            >
              ShowRoom
            </span>
          </Link>

          {/* Desktop Links */}
          <ul className="hidden lg:flex gap-5">
            {navLinks
              .sort((a, b) => a.index - b.index)
              .map((val, i) => (
                <Link key={i} to={val.href}>
                  <li
                    className={`cursor-pointer  duration-200 bg-clip-text p-1  ${
                      pathname === val.href ? "font-bold text-transparent " : ""
                    }`}
                    style={
                      pathname === val.href
                        ? {
                            backgroundImage:
                              "linear-gradient(to right, #1a2a6c, #ff7e5f)",
                          }
                        : null
                    }
                  >
                    {val.label}
                  </li>
                </Link>
              ))}
          </ul>
        </div>

        {/* Right Icons Container */}
        <div className="flex gap-10 lg:gap-15 items-center">
          <Link to={"/search"}>
            <FaSearch className="cursor-pointer" size={20} />
          </Link>
          {user ? (
            <Link
              to={"/profile"}
              className="flex items-center gap-5 relative profile cursor-pointer"
            >
              <i className="fa-solid fa-user"></i>
            </Link>
          ) : (
            <Link to={"/login"}>
              <i className="fa-solid fa-user"></i>
            </Link>
          )}
          {user ? (
            <Link
              to={"/login"}
              className="text-white"
              onClick={handleLogout}
            >
              Logout
            </Link>
          ) : (
            <Link to={"/login"} className="text-white">
              Login
            </Link>
          )}
        </div>
      </nav>
      <ul className="fixed -bottom-10 right-0 left-0 w-full bg-[#191919] flex text-[8px] gap-4 items-center justify-center p-5 px-6 md:hidden z-50 rounded-t-lg">
        {navLinks
          .sort((a, b) => a.order - b.order)
          .map((val, i) => (
            <Link
              key={i}
              to={val.href}
              className={`flex flex-col items-center justify-center min-w-[20%] max-w-[20%] `}
            >
              <span
                className={`${
                  pathname === val.href
                    ? "absolute px-6 py-2 -skew-x-[20deg] bottom-[70%] shadow-lg gg rounded-lg"
                    : ""
                }`}
              >
                <i
                  className={`fa-solid ${val.icon} ${
                    pathname === val.href
                      ? "font-bold text-sm skew-x-[20deg]"
                      : ""
                  }`}
                ></i>
              </span>
              <li className={`cursor-pointer py-2 px-4 whitespace-nowrap`}>
                {val.label}
              </li>
            </Link>
          ))}
      </ul>
    </>
  );
};

export default Navbar;
