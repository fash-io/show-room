import React, { useEffect, useState } from 'react'
import { BiUpArrow } from 'react-icons/bi'

const ScrollToTop = () => {
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 1000) {
        setVisible(true)
      } else {
        setVisible(false)
      }
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [window.scrollY])
  if (visible)
    return (
      <button
        className='fixed bottom-32 right-2 p-3 md:bottom-10 md:right-5 rounded-full bg-[#3b82f6] z-40 group duration-200'
        onClick={() =>
          window.scroll({
            top: 0,
            behavior: 'smooth'
          })
        }
      >
        <BiUpArrow size={20} />
        <span className='absolute bg-white/40 text-black px-2 py-1 rounded -top-11 -right-5 opacity-0 md:group-hover:opacity-100 duration-200'>
          ScrollToTop
        </span>
      </button>
    )
}

export default ScrollToTop
