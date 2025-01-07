export const navLinks = [
  { label: 'Home', href: '/', icon: 'fa-house', order: 3, index: 1 },
  { label: 'TV Shows', href: '/series', icon: 'fa-tv', order: 1, index: 2 },
  { label: 'Movies', href: '/movies', icon: 'fa-film', order: 2, index: 3 },
  { label: 'Trending', href: '/trending', icon: 'fa-fire', order: 4, index: 4 },
  { label: 'My List', href: '/list', icon: 'fa-list', order: 5, index: 5 },
  { label: 'Poster', href: '/poster', icon: 'fa-images', order: 0, index: 6 }
]

export const footerLinks = [
  { label: 'FAQ', href: '/faq' },
  { label: 'Contact Us', href: '/contact-us' },
  { label: 'Search', href: '/search' },
  {
    label: 'Random Actor',
    href: `/person/${Math.floor(Math.random() * 10000) + 1}`
  },
  {
    label: 'Random Movie',
    href: `/movie/${Math.floor(Math.random() * 10000) + 1}`
  },
  {
    label: 'Random Tv Show',
    href: `/series/${Math.floor(Math.random() * 10000) + 1}`
  }
]

export const movieGenre = [
  { id: 28, name: 'Action' },
  { id: 12, name: 'Adventure' },
  { id: 16, name: 'Animation' },
  { id: 35, name: 'Comedy' },
  { id: 80, name: 'Crime' },
  { id: 99, name: 'Documentary' },
  { id: 18, name: 'Drama' },
  { id: 10751, name: 'Family' },
  { id: 14, name: 'Fantasy' },
  { id: 36, name: 'History' },
  { id: 27, name: 'Horror' },
  { id: 10402, name: 'Music' },
  { id: 9648, name: 'Mystery' },
  { id: 10749, name: 'Romance' },
  { id: 878, name: 'Science Fiction' },
  { id: 10770, name: 'TV Movie' },
  { id: 53, name: 'Thriller' },
  { id: 10752, name: 'War' },
  { id: 37, name: 'Western' }
]

export const tvGenre = [
  { id: 10759, name: 'Action & Adventure' },
  { id: 16, name: 'Animation' },
  { id: 35, name: 'Comedy' },
  { id: 80, name: 'Crime' },
  { id: 99, name: 'Documentary' },
  { id: 18, name: 'Drama' },
  { id: 10751, name: 'Family' },
  { id: 10762, name: 'Kids' },
  { id: 9648, name: 'Mystery' },
  { id: 10763, name: 'News' },
  { id: 10764, name: 'Reality' },
  { id: 10765, name: 'Sci-Fi & Fantasy' },
  { id: 10766, name: 'Soap' },
  { id: 10767, name: 'Talk' },
  { id: 10768, name: 'War & Politics' },
  { id: 37, name: 'Western' }
]

export const faqs = [
  {
    question: 'What is ShowRoom?',
    answer:
      'ShowRoom is your gateway to entertainment, offering a wide range of movies and TV shows for streaming. We provide personalized recommendations and an easy-to-use interface.'
  },
  {
    question: 'How can I create an account?',
    answer:
      "To create an account, click on the 'Sign Up' button on the homepage or the login page. Enter your details, including your name, email, and password, and follow the prompts."
  },
  {
    question: 'How do I reset my password?',
    answer:
      "If you’ve forgotten your password, click on the 'Forgot Password' link on the login page. Enter your email address, and you’ll receive instructions to reset your password."
  },
  {
    question: 'Can I cancel my subscription?',
    answer:
      'Yes, you can cancel your subscription at any time through your account settings. If you need assistance, please contact our support team.'
  },
  {
    question: 'How do I contact customer support?',
    answer:
      "You can contact our customer support team by visiting the 'Contact Us' page on our website. We’re available 24/7 to assist you with any issues or questions."
  }
]

export const featured = [
  { title: "Now in Cinema's", category: 'now_playing', type: 'movie' },
  { title: 'Popular Movies', category: 'popular', type: 'movie' },
  { title: 'Top Rated Movies', category: 'top_rated', type: 'movie' },
  { title: 'Upcoming Movies', category: 'upcoming', type: 'movie' },
  { title: 'Popular Series', category: 'popular', type: 'tv' },
  { title: 'Top Rated Series', category: 'top_rated', type: 'tv' },
  { title: 'On The Air', category: 'on_the_air', type: 'tv' },
  { title: 'Your Watch List', userWatchlist: true }
]

export const actorLinks = [
  { name: 'imdb_id', href: 'https://www.imdb.com/name/' },
  { name: 'tiktok_id', href: 'https://tiktok.com/@' },
  {
    name: 'youtube_id',
    href: 'https://www.youtube.com/'
  },
  {
    name: 'facebook_id',
    href: 'https://www.facebook.com/'
  },
  {
    name: 'instagram_id',
    href: 'https://www.instagram.com/'
  },
  {
    name: 'twitter_id',
    href: 'https://twitter.com/'
  }
]

export const actorDetails = [
  { label: 'Known For', path: 'known_for_department' },
  { label: 'Known Credits', detail: 'length' },
  {
    label: 'Gender',
    path: 'gender'
  },
  {
    label: 'Birthdate',
    path: 'birthday'
  },
  {
    label: 'Place of Birth',
    path: 'place_of_birth'
  },
  {
    label: 'Also known as',
    path: 'also_known_as'
  }
]
