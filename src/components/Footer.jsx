import youtube_icon from "../assets/youtube_icon.png";
import twitter_icon from "../assets/twitter_icon.png";
import instagram_icon from "../assets/instagram_icon.png";
import facebook_icon from "../assets/facebook_icon.png";
import { footerLinks } from "../constants";

const Footer = () => {
  return (
    <div className="py-8 px-4 sm:px-[4%] max-w-[1000px] mx-auto">
      {/* Social Media Icons */}
      <div className="flex gap-3 sm:gap-5 my-6 sm:my-10 justify-center sm:justify-start">
        <img src={youtube_icon} alt="YouTube" width={30} className="cursor-pointer" />
        <img src={twitter_icon} alt="Twitter" width={30} className="cursor-pointer" />
        <img src={instagram_icon} alt="Instagram" width={30} className="cursor-pointer" />
        <img src={facebook_icon} alt="Facebook" width={30} className="cursor-pointer" />
      </div>
      
      {/* Footer Links */}
      <ul className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4 mb-6 sm:mb-8 text-center sm:text-left">
        {footerLinks.map((val, index) => (
          <li key={index} className="text-sm sm:text-base">
            {val.label}
          </li>
        ))}
      </ul>
      
      {/* Footer Text */}
      <p className="text-stone-500 text-xs sm:text-sm text-center sm:text-left">
        © 1997-2023 Netflix, Inc.
      </p>
      <p className="w-full h-20 md:hidden"></p>
    </div>
  );
};

export default Footer;
