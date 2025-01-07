const LoadingSpinner = () => {
  return (
    <div className="flex justify-center items-center">
      <div className="w-12 h-12 border-t-4 border-b-4 border-yellow-500 rounded-full animate-spin"></div>
    </div>
  );
};

export default LoadingSpinner;
