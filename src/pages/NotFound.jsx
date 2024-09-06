import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-gray-800 via-gray-900 to-black text-white p-4 md:p-8 text-center">
      <h1 className="text-6xl sm:text-8xl font-bold mb-4">404</h1>
      <h2 className="text-3xl sm:text-5xl mb-4">Page Not Found</h2>
      <p className="text-lg sm:text-xl mb-4">
        The page you are looking for does not exist.
      </p>
      <Link
        to="/"
        className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 text-sm sm:text-base"
        aria-label="Go to Home"
      >
        Go to Home
      </Link>
    </div>
  );
};

export default NotFound;
