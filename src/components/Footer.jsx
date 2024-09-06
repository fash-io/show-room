import youtube_icon from "../assets/youtube_icon.png";
import twitter_icon from "../assets/twitter_icon.png";
import instagram_icon from "../assets/instagram_icon.png";
import facebook_icon from "../assets/facebook_icon.png";
import { footerLinks } from "../constants";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <div className="text-white py-10 px-6 sm:px-[4%] max-w-[1200px] mx-auto">
      {/* Social Media Icons */}
      <div className="flex justify-center sm:justify-start gap-4 mb-8">
        <a
          href="#"
          aria-label="YouTube"
          className="transition transform hover:scale-110"
        >
          <img src={youtube_icon} alt="YouTube" width={40} />
        </a>
        <a
          href="#"
          aria-label="Twitter"
          className="transition transform hover:scale-110"
        >
          <img src={twitter_icon} alt="Twitter" width={40} />
        </a>
        <a
          href="#"
          aria-label="Instagram"
          className="transition transform hover:scale-110"
        >
          <img src={instagram_icon} alt="Instagram" width={40} />
        </a>
        <a
          href="#"
          aria-label="Facebook"
          className="transition transform hover:scale-110"
        >
          <img src={facebook_icon} alt="Facebook" width={40} />
        </a>
      </div>

      {/* Footer Links */}
      <ul className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8 text-center sm:text-left">
        {footerLinks.map((val, index) => (
          <li key={index} className="text-sm sm:text-base">
            <Link
              to={val.url}
              className="hover:text-transparent transition duration-200 hover bg-clip-text bg-gradient-to-r from-[#1a2a6c] to-[#ff7e5f]"
            >
              {val.label}
            </Link>
            
          </li>
        ))}
      </ul>

      {/* Footer Text */}
      <div className="border-t border-gray-700 pt-6">
        <p className="text-stone-400 text-xs sm:text-sm text-center sm:text-left">
          © 2024 ShowRoom, Inc. All rights reserved.
        </p>
        <p className="text-center sm:text-left mt-2">
          ShowRoom – Your gateway to entertainment.
        </p>
      </div>
      <div className="h-20 w-full block sm:hidden"></div>
    </div>
  );
};

export default Footer;
