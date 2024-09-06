import { useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';

const GoBackButton = () => {
  const navigate = useNavigate();

  return (
    <button
      title="Go Back"
      onClick={() => navigate(-1)}
      className="hidden sm:block z-30 fixed top-20 left-4 bg-gray-800 text-white p-2 rounded-full shadow-md hover:bg-gray-700 transition-colors duration-200"
      aria-label="Go Back"
    >
      <FaArrowLeft size={24} />
    </button>
  );
};

export default GoBackButton;
