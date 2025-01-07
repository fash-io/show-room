import { BsInstagram, BsTwitter, BsYoutube } from 'react-icons/bs'
import { footerLinks } from '../constants'
import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <div className={'text-white py-10 px-6 sm:px-[4%] max-w-[1200px] mx-auto '}>
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

      <ul className='grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8 text-center sm:text-left'>
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

      <div className='border-t border-gray-700 pt-6'>
        <p className='text-stone-400 text-xs sm:text-sm text-center sm:text-left'>
          © 2024 ShowRoom, Inc. All rights reserved.
        </p>
        <p className='text-center text-xs sm:text-left mt-2'>
          ShowRoom – Your gateway to entertainment.
        </p>
      </div>
      <div className='h-20 w-full block sm:hidden'></div>
    </div>
  )
}

export default Footer
