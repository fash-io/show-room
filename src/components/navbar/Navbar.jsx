import { navLinks } from '../../constants'
import { useContext, useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import UserContext from '../../UserContext'
import 'react-toastify/dist/ReactToastify.css'
import SearchBar from './SearchBar'

const Navbar = () => {
  const { userData } = useContext(UserContext)
  const [photo, setPhoto] = useState('')
  const [searchIcon, setSearchIcon] = useState(false)
  const { pathname } = useLocation()
  const navRef = useRef()

  useEffect(() => {
    if (userData) {
      setPhoto(userData?.photoURL)
    }
  }, [userData])

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }, [pathname])

  useEffect(() => {
    const handleScroll = () => {
      if (
        location.pathname === '/' ||
        location.pathname === '/movies' ||
        location.pathname === '/series'
      ) {
        if (window.scrollY > 300) {
          navRef.current.classList.add('md:bg-black/50', 'md:backdrop-blur-md')
        } else {
          navRef.current.classList.remove(
            'md:bg-black/50',
            'md:backdrop-blur-md'
          )
        }
      } else {
        if (window.scrollY > 10) {
          navRef.current.classList.add('md:bg-black/50', 'md:backdrop-blur-md')
        } else {
          navRef.current.classList.remove(
            'md:bg-black/50',
            'md:backdrop-blur-md'
          )
        }
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [location])

  return (
    <>
      <nav
        ref={navRef}
        className='w-full fixed py-1 md:py-5 px-2 md:px-[6%] flex justify-between items-center text-white z-[998] text-sm duration-300 bg-transparent'
        style={{
          backgroundImage:
            'linear-gradient(180deg, rgba(0,0,0,0.7) 30%, transparent)'
        }}
      >
        <Link to={'/'}>
          <img src='/5188399.png' className='w-9 md:w-14 aspect-auto' />
        </Link>

        <ul
          className={`hidden md:flex gap-8 transition-colors ${
            searchIcon && 'md:hidden lg:flex'
          }`}
        >
          {navLinks
            .filter(_ => _.order < 6)
            .sort((a, b) => a.index - b.index)
            .map((val, i) => (
              <Link key={i} to={val.href}>
                <li
                  className={`cursor-pointer text-xs lg:text-base transition-colors duration-200 bg-clip-text hover:text-transparent bg-gradient-to-r from-[#ff7e5f] via-pink-500 to-[#1a2a6c] ${
                    pathname === val.href ? 'text-transparent active' : ''
                  }`}
                >
                  {val.label}
                </li>
              </Link>
            ))}
          <Link to={'/top-people'}>
            <li
              className={`cursor-pointer text-xs lg:text-base transition-colors duration-200 bg-clip-text hover:text-transparent bg-gradient-to-r from-[#ff7e5f] via-pink-500 to-[#1a2a6c] ${
                pathname === '/top-people' ? 'text-transparent active' : ''
              }`}
            >
              People
            </li>
          </Link>
        </ul>

        {!(pathname === '/profile') && (
          <div className=' flex gap-4 lg:gap-8 items-center justify-between max-md:hidden'>
            <SearchBar searchIcon={searchIcon} setSearchIcon={setSearchIcon} />
            {userData && Object.keys(userData).length !== 0 ? (
              <Link
                to={'/profile'}
                className='max-md:hidden flex items-center profile cursor-pointer'
              >
                {photo ? (
                  <img
                    src={photo}
                    alt='Profile'
                    className='w-9 h-9 rounded-full object-cover'
                  />
                ) : (
                  <i className='fa-solid fa-user'></i>
                )}
              </Link>
            ) : (
              <Link
                to={'/login'}
                className=' text-white h-full w-full flex items-center'
              >
                Login
              </Link>
            )}
          </div>
        )}
      </nav>

      <ul
        className={
          'fixed bottom-0 right-0 left-0 bg-[#191919] flex text-[8px] gap-4 items-center justify-center px-12 md:hidden z-[999] '
        }
      >
        {navLinks
          .filter(link => link.order > 0)
          .sort((a, b) => a.order - b.order)
          .map((val, i) => (
            <Link
              key={i}
              to={val.href}
              className={`flex flex-col items-center justify-center min-w-[21%] max-w-[21%] duration-300 bg-`}
            >
              <span
                className={`${
                  pathname === val.href
                    ? 'absolute px-[20px] py-[3px] -skew-x-[25deg] bottom-[75%] shadow-lg gg rounded bg-gradient-to-r duration-300 from-[#ff7e5f] to-[#1a2a6c]'
                    : ''
                }`}
              >
                <i
                  className={`fa-solid  ${val.icon} ${
                    pathname === val.href
                      ? 'font-bold skew-x-[25deg] text-sm duration-300'
                      : 'py-5'
                  }`}
                ></i>
              </span>
              {pathname === val.href && (
                <li
                  className={`cursor-pointer text-[8px] duration-300 pt-[4px] whitespace-nowrap`}
                >
                  {val.label}
                </li>
              )}
            </Link>
          ))}
        {navLinks
          .filter(val => val.order === 0)
          .map((val, i) => (
            <Link
              key={i}
              to={val.href}
              className='fixed bottom-[8%] right-[2%] z-50 p-3 py-2 aspect-square rounded-full bg-gradient-to-r from-[#ff7e5f] to-[#1a2a6c]'
            >
              <i className={`fa-solid ${val.icon} text-lg`}></i>
            </Link>
          ))}
      </ul>
    </>
  )
}

export default Navbar
