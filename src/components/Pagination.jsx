import { useEffect, useState } from "react";

const Pagination = (props) => {
  const { totalPages, page, handlePageChange, loading } = props;

  const [displayPage, setDisplayPage] = useState(page);

  const handleDisplayPageChange = (e) => {
    setDisplayPage(e.target.value);
  };
  useEffect(() => {
    handlePageChange(displayPage);
  }, [displayPage]);

  return (
    <>
      <div className="mt-8 flex justify-center items-center ">
        <button
          onClick={() => handlePageChange(1)}
          disabled={page === 1 || loading}
          className={`py-2 px-4 rounded-l ${
            page === 1 || loading
              ? "bg-gray-700 text-gray-500 cursor-not-allowed"
              : "bg-gray-800 text-white hover:bg-gray-700"
          }`}
          title="Go to First Page"
        >
          «
        </button>
        <button
          onClick={() => handlePageChange(page - 1)}
          disabled={page === 1 || loading}
          className={`py-2 px-4  ${
            page === 1 || loading
              ? "bg-gray-700 text-gray-500 cursor-not-allowed"
              : "bg-gray-800 text-white hover:bg-gray-700"
          }`}
          title="Go to Previous Page"
        >
          ‹
        </button>
        <input
          type="text"
          className="text-white max-w-[40px] bg-black/0 border-none outline- text-center p-[5px] m-1"
          onChange={(e) => {
            handleDisplayPageChange(e);
          }}
          value={displayPage}
        />
        <button
          onClick={() => handlePageChange(page + 1)}
          disabled={page === totalPages || loading}
          className={`py-2 px-4  ${
            page === totalPages || loading
              ? "bg-gray-700 text-gray-500 cursor-not-allowed"
              : "bg-gray-800 text-white hover:bg-gray-700"
          }`}
          title="Go to Next Page"
        >
          ›
        </button>
        <button
          onClick={() => handlePageChange(totalPages)}
          disabled={page === totalPages || loading}
          className={`py-2 px-4 rounded-r ${
            page === totalPages || loading
              ? "bg-gray-700 text-gray-500 cursor-not-allowed"
              : "bg-gray-800 text-white hover:bg-gray-700"
          }`}
          title={`Go to Last Page (${totalPages})`}
        >
          »
        </button>
      </div>
    </>
  );
};

export default Pagination;
