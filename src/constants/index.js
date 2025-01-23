export const navLinks = [
  { label: 'Home', href: '/', icon: 'fa-house', order: 3, index: 1 },
  { label: 'Shows', href: '/shows', icon: 'fa-tv', order: 2, index: 2 },
  { label: 'Trending', href: '/trending', icon: 'fa-fire', order: 1, index: 4 },
  { label: 'My List', href: '/list', icon: 'fa-list', order: 5, index: 5 },
  { label: 'Poster', href: '/poster', icon: 'fa-images', order: 0, index: 6 },
  { label: 'Profile', href: '/profile', icon: 'fa-user', order: 6, index: 6 }
]

export const footerLinks = [
  { label: 'FAQ', href: '/faq' },
  { label: 'Contact Us', href: '/contact-us' },
  { label: 'People', href: '/top-people?page=1' }
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
  { title: 'Your Watch List', userWatchList: true },
  { title: 'Now in Cinemas', category: 'now_playing', type: 'movie' },
  // { title: 'Trending Movies', category: 'popular', type: 'movie' },
  { title: 'Coming Soon', category: 'upcoming', type: 'movie' },
  {
    title: 'Top 10 (Movies)',
    type: 'movie',
    url: 'https://api.themoviedb.org/3/trending/movie/week?language=en-US'
  },
  { title: 'Popular TV Shows', category: 'popular', type: 'tv' },
  { title: 'Top Rated TV Shows', category: 'top_rated', type: 'tv' },
  {
    title: 'Top 10 (Series)',
    type: 'tv',
    url: 'https://api.themoviedb.org/3/trending/tv/week?language=en-US'
  },
  {
    title: 'Romantic Comedies',
    feature: [{ label: '&with_genres', key: '10749,35' }]
  },
  { title: 'Critics’ Picks', category: 'top_rated', type: 'movie' },
  {
    title: 'Epic Adventures',
    feature: [{ label: '&with_genres', key: '12,28' }]
  },
  {
    title: 'Chilling Thrillers',
    feature: [{ label: '&with_genres', key: '53,27' }]
  },
  {
    title: 'Historical Dramas',
    feature: [{ label: '&with_genres', key: '36,18' }]
  },
  { title: 'Currently Airing', category: 'on_the_air', type: 'tv' },
  {
    title: 'Feel-Good Movies',
    feature: [{ label: '&with_genres', key: '10751,35' }]
  },
  {
    title: 'Sci-fi & Fantasy',
    feature: [{ label: '&with_genres', key: '878,14' }]
  },
  {
    title: 'Mystery & Suspense',
    feature: [{ label: '&with_genres', key: '9648,53' }]
  }
]

export const FeaturedSeriesTitles = [
  { title: 'Trending Series', category: 'popular', type: 'tv' },
  { title: 'Critically Acclaimed Series', category: 'top_rated', type: 'tv' },
  {
    title: 'Romantic Drama',
    feature: [
      { label: '&with_genres', key: '18' },
      { label: '&with_keywords', key: '9840' }
    ]
  },
  {
    title: 'Action-packed Thrillers',
    feature: [{ label: '&with_genres', key: '10759' }]
  },
  {
    title: 'Top 10',
    url: 'https://api.themoviedb.org/3/trending/tv/week?language=en-US',
    type: 'tv'
  },
  {
    title: 'Netflix Top 10',
    feature: [
      { label: '&with_networks', key: '213' },
      {
        label: '&air_date.gte',
        key: new Date(new Date().setMonth(new Date().getMonth() - 1))
          .toISOString()
          .split('T')[0]
      }
    ]
  },
  {
    title: 'Anime',
    feature: [{ label: '&with_keywords', key: '210024' }]
  },
  {
    title: 'K-Drama',
    feature: [
      { label: '&with_genres', key: '18' },
      { label: '&with_original_language', key: 'ko' }
    ]
  },
  {
    title: 'Crime Shows',
    feature: [{ label: '&with_genres', key: '80' }]
  },
  {
    title: 'Family Favorites',
    feature: [
      { label: '&with_genres', key: '10762,10751' },
      { label: '&without_keywords', key: '210024' }
    ]
  },
  {
    title: 'New releases',
    feature: [
      {
        label: '&first_air_date.gte',
        key: new Date(new Date().setMonth(new Date().getMonth() - 6))
          .toISOString()
          .split('T')[0]
      }
    ],

    sort: 'first_air_date.desc'
  },
  {
    title: 'Sci-fi Adventures',
    feature: [
      { label: '&with_genres', key: '10765,10759' },
      { label: '&without_keywords', key: '210024' }
    ]
  },
  {
    title: 'Reality Shows',
    feature: [{ label: '&with_genres', key: '10764' }]
  },
  {
    title: 'Documentaries',
    feature: [{ label: '&with_genres', key: '99' }]
  },
  {
    title: 'Supernatural Tales',
    feature: [
      { label: '&with_genres', key: '10765' },
      { label: '&without_keywords', key: '210024' }
    ]
  },
  {
    title: 'Teen Dramas',
    feature: [
      { label: '&with_genres', key: '18' },
      { label: '&with_keywords', key: '193400' }
    ]
  },
  {
    title: 'Sitcoms',
    feature: [{ label: '&with_keywords', key: '193171' }]
  },
  {
    title: 'Fantasy anime',
    feature: [{ label: '&with_keywords', key: '293198,210024' }]
  }
]

export const FeaturedMoviesTitles = [
  { title: 'Box Office Hits', category: 'popular', type: 'movie' },
  { title: 'Award-Winning Movies', category: 'top_rated', type: 'movie' },
  {
    title: 'Animated Favorites',
    feature: [{ label: '&with_genres', key: '16' }]
  },
  {
    title: 'Romantic Comedies',
    feature: [{ label: '&with_genres', key: '10749,35' }]
  },
  {
    title: 'Top 10',
    url: 'https://api.themoviedb.org/3/trending/movie/week?language=en-US',
    type: 'movie'
  },
  {
    title: 'Netflix Top 10',
    feature: [
      { label: '&with_networks', key: '213' },
      {
        label: '&air_date.gte',
        key: new Date(new Date().setMonth(new Date().getMonth() - 1))
          .toISOString()
          .split('T')[0]
      }
    ]
  },
  {
    title: 'Heart-Stopping Action',
    feature: [{ label: '&with_genres', key: '28' }]
  },
  {
    title: 'Crime Thrillers',
    feature: [{ label: '&with_genres', key: '80,53' }]
  },
  {
    title: 'Laugh Out Loud',
    feature: [{ label: '&with_genres', key: '35' }]
  },
  {
    title: 'Dramatic Masterpieces',
    feature: [{ label: '&with_genres', key: '18' }]
  },
  {
    title: 'Adventurous Journeys',
    feature: [{ label: '&with_genres', key: '12' }]
  },
  {
    title: 'Family Fun',
    feature: [{ label: '&with_genres', key: '10751' }]
  },
  {
    title: 'Horror Flicks',
    feature: [{ label: '&with_genres', key: '27' }]
  },
  {
    title: 'Sci-fi Spectacles',
    feature: [{ label: '&with_genres', key: '878' }]
  },
  {
    title: 'Musical Hits',
    feature: [{ label: '&with_genres', key: '10402' }]
  },
  {
    title: 'Historical Epics',
    feature: [{ label: '&with_genres', key: '36' }]
  },
  {
    title: 'Feel-Good Stories',
    feature: [{ label: '&with_genres', key: '10751,18' }]
  },
  {
    title: 'War Dramas',
    feature: [{ label: '&with_genres', key: '10752' }]
  },
  {
    title: 'Fantasy Adventures',
    feature: [{ label: '&with_genres', key: '14,12' }]
  },
  {
    title: 'Biographical Films',
    genre: '36,18',
    feature: [{ label: '&with_genres', key: '36,18' }]
  }
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

export const sortOptions = [
  {
    label: 'Popularity Descending',
    key: 'popularity.desc'
  },
  {
    label: 'Popularity Ascending',
    key: 'popularity.asc'
  },
  {
    label: 'Release Date Descending',
    key: 'release_date.desc'
  },
  {
    label: 'Release Date Ascending',
    key: 'release_date.asc'
  },
  {
    label: 'Title Descending',
    key: 'original_title.desc'
  },
  {
    label: 'Title Ascending',
    key: 'original_title.asc'
  },
  {
    label: 'Revenue Descending',
    key: 'revenue.desc'
  },
  {
    label: 'Revenue Ascending',
    key: 'revenue.asc'
  },

  {
    label: 'Release Date Descending',
    key: 'primary_release_date.desc'
  },
  {
    label: 'Release Date Ascending',
    key: 'primary_release_date.asc'
  },
  {
    label: 'Vote Average Descending',
    key: 'vote_average.desc'
  },
  {
    label: 'Vote Average Ascending',
    key: 'vote_average.asc'
  },
  {
    label: 'Title Descending',
    key: 'title.desc'
  },
  {
    label: 'Title Ascending',
    key: 'title.asc'
  },
  {
    label: 'Vote Count Descending',
    key: 'vote_count.desc'
  },
  {
    label: 'Vote Count Ascending',
    key: 'vote_count.asc'
  }
]
