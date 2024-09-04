const Loading = ({ isSmall }) => (
  isSmall ? (
    <div className="bg-gray-900 z-10 text-white h-full w-full top-0 flex items-center justify-center">
      <div className="p-4 rounded-lg text-center">
        <p className="text-xl font-semibold">Loading</p>
        <p className="text-lg spans">
          <span>.</span>
          <span>.</span>
          <span>.</span>
        </p>
      </div>
    </div>
  ) : (
    <div className="bg-gray-900 z-50 text-white h-screen fixed top-0 bottom-0 left-0 right-0 flex items-center justify-center">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg text-center">
        <p className="text-xl font-semibold">Loading</p>
        <p className="text-2xl spans">
          <span>.</span>
          <span>.</span>
          <span>.</span>
        </p>
      </div>
    </div>
  )
);

export default Loading;
