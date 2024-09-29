export const options = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization:
      "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIyOTk4YjQyMDliOGZjYWJiMGY5NmRkYTU3ZDlhZjI5ZiIsIm5iZiI6MTcyNDk1OTg0Ni44NjEzMTksInN1YiI6IjY2ZDBjYWUwNDYxZTRjNDg4N2IxMzVkMSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.8QXxSpY5y4m-sXdD9Qp0TuBfbdUjUiSvTHL_rY0mP4A",
  },
};
export const fetchDetails = async (id, type) => {
  try {
    const response = await fetch(
      `https://api.themoviedb.org/3/${
        type === "movie" ? "movie" : "tv"
      }/${id}?language=en-US`,
      options
    );
    const data = await response.json();
    return { ...data, type };
  } catch (error) {
    console.error(`Error fetching details for ${type} with ID ${id}:`, error);
    return null;
  }
};
