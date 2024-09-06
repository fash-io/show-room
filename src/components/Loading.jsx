const Loading = ({ isSmall }) => {
  return (
    <div
      className={`bg-gradient-to-r from-gray-800 via-gray-900 to-black  text-white flex items-center justify-center ${
        isSmall
          ? "z-10 h-full w-full"
          : "fixed top-0 bottom-0 left-0 right-0 h-screen z-50"
      }`}
    >
      <div
        className={` rounded-lg text-center ${
          isSmall ? "p-4" : "bg-gray-800 p-8 shadow-lg"
        }`}
      >
        <p className="text-xl font-semibold">Loading</p>
        <p className={`spans ${isSmall ? "text-lg" : "text-2xl"}`}>
          <span>.</span>
          <span>.</span>
          <span>.</span>
        </p>
      </div>
    </div>
  );
};

export default Loading;
