export const navLinks = [
  { label: "Home", href: "/", icon: "fa-house", order: 3, index: 1 },
  { label: "TV Shows", href: "/series", icon: "fa-tv", order: 1, index: 2 },
  { label: "Movies", href: "/movies", icon: "fa-film", order: 2, index: 3 },
  { label: "Trending", href: "/trending", icon: "fa-fire", order: 4, index: 4 },
  { label: "My List", href: "/list", icon: "fa-list", order: 5, index: 5 },
];
export const footerLinks = [
  { label: "Audio Description" },
  { label: "Help Centre" },
  { label: "Gift Cards" },
  { label: "Media Centre" },
  { label: "Investor Relations" },
  { label: "Jobs" },
];
export const movieGenre = [
  { id: 28, name: "Action" },
  { id: 12, name: "Adventure" },
  { id: 16, name: "Animation" },
  { id: 35, name: "Comedy" },
  { id: 80, name: "Crime" },
  { id: 99, name: "Documentary" },
  { id: 18, name: "Drama" },
  { id: 10751, name: "Family" },
  { id: 14, name: "Fantasy" },
  { id: 36, name: "History" },
  { id: 27, name: "Horror" },
  { id: 10402, name: "Music" },
  { id: 9648, name: "Mystery" },
  { id: 10749, name: "Romance" },
  { id: 878, name: "Science Fiction" },
  { id: 10770, name: "TV Movie" },
  { id: 53, name: "Thriller" },
  { id: 10752, name: "War" },
  { id: 37, name: "Western" },
];
export const tvGenre = [
  { id: 10759, name: "Action & Adventure" },
  { id: 16, name: "Animation" },
  { id: 35, name: "Comedy" },
  { id: 80, name: "Crime" },
  { id: 99, name: "Documentary" },
  { id: 18, name: "Drama" },
  { id: 10751, name: "Family" },
  { id: 10762, name: "Kids" },
  { id: 9648, name: "Mystery" },
  { id: 10763, name: "News" },
  { id: 10764, name: "Reality" },
  { id: 10765, name: "Sci-Fi & Fantasy" },
  { id: 10766, name: "Soap" },
  { id: 10767, name: "Talk" },
  { id: 10768, name: "War & Politics" },
  { id: 37, name: "Western" },
];
export function calculateAge(birthDate) {
  const today = new Date();
  const birth = new Date(birthDate);

  let age = today.getFullYear() - birth.getFullYear();
  const monthDifference = today.getMonth() - birth.getMonth();
  const dayDifference = today.getDate() - birth.getDate();

  // Adjust age if the birthday hasn't occurred yet this year
  if (monthDifference < 0 || (monthDifference === 0 && dayDifference < 0)) {
    age--;
  }

  // Calculate precise months and days
  let months = monthDifference >= 0 ? monthDifference : 12 + monthDifference;
  let days =
    dayDifference >= 0
      ? dayDifference
      : new Date(today.getFullYear(), today.getMonth(), 0).getDate() +
        dayDifference;

  return { years: age, months, days };
}
