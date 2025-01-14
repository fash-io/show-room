import axios from 'axios'
import { movieGenre, tvGenre } from '../constants'
import { options } from './api'

export const fonts = [
  {
    name: 'Bebas Neue',
    className: 'font-bebas action-style',
    genres: ['Action', 'Thriller', 'Adventure']
  },
  {
    name: 'Cinzel',
    className: 'font-cinzel fantasy-style',
    genres: ['Drama', 'Fantasy', 'History']
  },
  {
    name: 'Creepster',
    className: 'font-creepster horror-style',
    genres: ['Horror', 'Crime', 'Thriller']
  },
  {
    name: 'Playfair Display',
    className: 'font-playfair romance-style',
    genres: ['Romance', 'Drama', 'Period']
  },
  {
    name: 'Nabla',
    className: 'font-nabla sci-fi-style',
    genres: ['Science Fiction', 'Animation']
  },
  {
    name: 'Lobster',
    className: 'font-lobster comedy-style',
    genres: ['Comedy', 'Family', 'Kids']
  },
  {
    name: 'Dancing Script',
    className: 'font-dancing music-style',
    genres: ['Music', 'TV Movie']
  },
  {
    name: 'Courier Prime',
    className: 'font-courier documentary-style',
    genres: ['Documentary', 'War', 'Politics']
  },
  {
    name: 'Abril Fatface',
    className: 'font-abril western-style',
    genres: ['Western', 'Reality']
  },
  {
    name: 'Oswald',
    className: 'font-oswald mystery-style',
    genres: ['Mystery', 'Crime', 'Suspense']
  },
  {
    name: 'Source Serif Pro',
    className: 'font-source-serif war-style',
    genres: ['War', 'History', 'Politics']
  },
  {
    name: 'Pacifico',
    className: 'font-pacifico family-style',
    genres: ['Family', 'Adventure']
  },
  {
    name: 'Fjalla One',
    className: 'font-fjalla sci-fi-style',
    genres: ['Action & Adventure', 'Sci-Fi & Fantasy']
  },
  {
    name: 'Permanent Marker',
    className: 'font-marker kids-style',
    genres: ['Kids', 'Animation']
  },
  {
    name: 'Shadows Into Light',
    className: 'font-shadows mystery-style',
    genres: ['Mystery', 'Fantasy']
  },
  {
    name: 'Lora',
    className: 'font-lora soap-style',
    genres: ['Soap', 'Romance']
  },
  {
    name: 'Anime Ace',
    className: 'font-anime anime-style',
    genres: ['Animation', 'Anime']
  }
]

const getGenreNameById = (genreId, genreList) => {
  const genre = genreList.find(item => item.id === genreId)
  return genre ? genre.name : null
}

export const getFontForGenres = (genreIds, type) => {
  const genreList = type === 'movie' ? movieGenre : tvGenre
  if (!genreIds || genreIds.length === 0) {
    return 'font-default'
  }

  const genreNames = genreIds
    .map(id => getGenreNameById(id, genreList))
    .filter(name => name)

  for (let priority = 0; priority < 3; priority++) {
    for (const genre of genreNames) {
      const matchingFont = fonts.find(font => font.genres[priority] === genre)
      if (matchingFont) {
        return matchingFont.className
      }
    }
  }

  const fallbackGenre = getGenreNameById(genreIds[1], genreList)
  const fallbackFont = fonts.find(font => font.genres.includes(fallbackGenre))

  return fallbackFont ? fallbackFont.className : 'font-default'
}
export const getLogos = async (url, setLogo) => {
  const logoData = await axios.get(url, options)
  if (logoData.data.logos && logoData.data.logos.length > 0) {
    const filteredLogos = logoData.data.logos.filter(
      logo => logo.iso_639_1 === 'en'
    )
    if (filteredLogos.length > 0) {
      setLogo(filteredLogos[0].file_path)
    } else {
      setLogo(logoData.logos[0].file_path)
    }
  }
}
