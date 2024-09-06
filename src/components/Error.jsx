const Error = ({
  error = "An unexpected error occurred. Please try again later.",
}) => {
  return (
    <div
      className="bg-gray-900 text-white min-h-screen flex items-center justify-center"
      role="alert"
    >
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg text-center">
        <p className="text-xl font-semibold">{error}</p>
      </div>
    </div>
  );
};

export default Error;