/* eslint-disable react/prop-types */
import './topten.css' // External CSS for styling
import { Link } from 'react-router-dom'

const TopTen = ({ data, type_ }) => {
  return (
    <div className='top-ten-container div pr-20 pl-14 py-5'>
      {data
        .filter((_, i) => i < 10)
        .map((item, index) => (
          <Link
            key={item.id}
            className='top-ten-item'
            to={`/${type_ === 'movie' ? 'movie' : 'series'}/${item.id}`}
          >
            <div className='top-ten-rank'>{index + 1}</div>
            <div className='top-ten-poster'>
              <img
                src={`https://image.tmdb.org/t/p/w500${item.poster_path}`}
                alt={item.title || item.name}
              />
            </div>
            <div className='top-ten-info  text-wrap '>
              <h3 className='top-ten-title'>{item.title || item.name}</h3>
            </div>
          </Link>
        ))}
    </div>
  )
}

export default TopTen
