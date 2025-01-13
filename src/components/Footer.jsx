import { BsInstagram, BsTwitter, BsYoutube } from 'react-icons/bs'
import { footerLinks } from '../constants'
import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <div
      className={
        'text-white bg-black rounded-t-full py-10 px-6 sm:px-[10%] max-w-[1200px] mx-auto '
      }
    >
      <div className='flex justify-between items-center flex-col md:flex-row'>
        <div className='flex justify-center sm:justify-start gap-4 mb-8'>
          <a
            href='#'
            aria-label='YouTube'
            className='transition transform hover:scale-110'
          >
            <BsYoutube />
          </a>
          <a
            href='#'
            aria-label='Twitter'
            className='transition transform hover:scale-110'
          >
            <BsTwitter />
          </a>
          <a
            href='#'
            aria-label='Instagram'
            className='transition transform hover:scale-110'
          >
            <BsInstagram />
          </a>
        </div>

        <ul className='flex gap-4 mb-8 text-center sm:text-left'>
          {footerLinks.map((val, index) => (
            <li key={index} className='text-sm sm:text-base'>
              <Link
                to={val.href}
                className='hover:text-transparent transition duration-200 bg-clip-text bg-gradient-to-r from-[#1a2a6c] to-[#ff7e5f]'
              >
                {val.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div className='flex flex-col md:flex-row  items-start md:items-end border-t border-gray-700'>
        <div className=' pt-6 flex flex-col'>
          <p className='text-stone-400 text-xs sm:text-sm text-center sm:text-left'>
            © 2024 ShowRoom, Inc. All rights reserved.
          </p>
          <p className='text-center text-xs sm:text-left mt-2'>
            ShowRoom – Your gateway to entertainment.
          </p>
        </div>
        <a
          href='https://themoviedb.org'
          target='_blank'
          className='text-center text-xs sm:text-left mt-2'
        >
          Movie database from TMDB aai.
        </a>
      </div>
      <div className='h-20 w-full block sm:hidden'></div>
    </div>
  )
}

export default Footer
