import React from 'react'
import { BsSpotify } from 'react-icons/bs'
import { FaFacebook, FaImdb, FaInstagram, FaTiktok } from 'react-icons/fa'
import { FaYoutube } from 'react-icons/fa6'
import styled from 'styled-components'

const SocialMediaIcon = () => {
  return (
    <StyledWrapper>
      <ul className='example-2'>
        <li className='icon-content'>
          <a
            href='https://www.spotify.com/'
            aria-label='Spotify'
            data-social='spotify'
          >
            <div className='filled' />
            <FaImdb />
          </a>
          <div className='tooltip'>Spotify</div>
        </li>
        <li className='icon-content'>
          <a
            href='https://www.pinterest.com/'
            aria-label='Pinterest'
            data-social='pinterest'
          >
            <div className='filled' />
            <FaTiktok />
          </a>
          <div className='tooltip'>Tiktok</div>
        </li>
        <li className='icon-content'>
          <a
            href='https://dribbble.com/'
            aria-label='Dribbble'
            data-social='dribbble'
          >
            <div className='filled' />
            <FaYoutube />
          </a>
          <div className='tooltip'>Dribbble</div>
        </li>
        <li className='icon-content'>
          <a
            href='https://telegram.org/'
            aria-label='Telegram'
            data-social='telegram'
          >
            <div className='filled' />
            <FaFacebook />
          </a>
          <div className='tooltip'>Telegram</div>
        </li>
        <li className='icon-content'>
          <a
            href='https://telegram.org/'
            aria-label='Telegram'
            data-social='telegram'
          >
            <div className='filled' />
            <FaInstagram />
          </a>
          <div className='tooltip'>Telegram</div>
        </li>
      </ul>
    </StyledWrapper>
  )
}

const StyledWrapper = styled.div`
  ul {
    list-style: none;
  }

  .example-2 {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .example-2 .icon-content {
    margin: 0 10px;
    position: relative;
  }
  .example-2 .icon-content .tooltip {
    position: absolute;
    top: -30px;
    left: 50%;
    transform: translateX(-50%);
    color: #fff;
    padding: 6px 10px;
    border-radius: 15px;
    opacity: 0;
    visibility: hidden;
    font-size: 14px;
    transition: all 0.3s ease;
  }
  .example-2 .icon-content:hover .tooltip {
    opacity: 1;
    visibility: visible;
    top: -50px;
  }
  .example-2 .icon-content a {
    position: relative;
    overflow: hidden;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 30px;
    height: 30px;
    border-radius: 20%;
    color: #4d4d4d;
    background-color: #ffff;
    transition: all 0.3s ease-in-out;
  }
  .example-2 .icon-content a:hover {
    box-shadow: 3px 2px 45px 0px rgb(0 0 0 / 50%);
  }
  .example-2 .icon-content a:hover {
    color: white;
  }
  .example-2 .icon-content a .filled {
    position: absolute;
    top: auto;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 0;
    background-color: #000;
    transition: all 0.3s ease-in-out;
  }
  .example-2 .icon-content a:hover .filled {
    height: 100%;
  }
  .example-2 .icon-content a[data-social='spotify'] .filled,
  .example-2 .icon-content a[data-social='spotify'] ~ .tooltip {
    background-color: #1db954;
  }
  .example-2 .icon-content a[data-social='pinterest'] .filled,
  .example-2 .icon-content a[data-social='pinterest'] ~ .tooltip {
    background-color: #bd081c;
  }
  .example-2 .icon-content a[data-social='dribbble'] .filled,
  .example-2 .icon-content a[data-social='dribbble'] ~ .tooltip {
    background-color: #ea4c89;
  }
  .example-2 .icon-content a[data-social='telegram'] .filled,
  .example-2 .icon-content a[data-social='telegram'] ~ .tooltip {
    background-color: #0088cc;
  }
`

export default SocialMediaIcon
