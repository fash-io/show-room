import React from 'react'
import styled from 'styled-components'
const StyledWrapper = styled.div`
  .loader {
    --size: 400px;
    --duration: 2.5s;
    --logo-color: grey;
    --background: linear-gradient(
      0deg,
      rgb(30 27 109 / 20%) 0%,
      rgb(137 76 161 / 20%) 100%
    );
    height: var(--size);
    aspect-ratio: 1;
    position: relative;
    pointer-events: none;
  }

  .loader .box {
    position: absolute;
    background: var(--background);
    border-radius: 50%;
    box-shadow: rgba(0, 0, 0, 0.5) 0px 10px 10px 0,
      inset rgba(205, 155, 255, 0.5) 0px 5px 10px -7px;
    animation: ripple var(--duration) infinite ease-in-out;
    inset: var(--inset);
    animation-delay: calc(var(--i) * 0.15s);
    z-index: calc(var(--i) * -1);
    pointer-events: all;
    transition: all 0.3s ease;
  }

  .loader .box:last-child {
    filter: blur(30px);
  }
  .loader .box:not(:last-child):hover {
    filter: brightness(2.5) blur(5px);
  }

  .loader .logo {
    position: absolute;
    inset: 0;
    display: grid;
    place-content: center;
    padding: 30%;
  }

  .loader .logo {
    width: 100%;
  }

  @keyframes ripple {
    0% {
      transform: scale(1);
      box-shadow: rgba(0, 0, 0, 0.5) 0px 10px 10px 0,
        inset rgba(205, 155, 255, 0.5) 0px 5px 10px -7px;
    }
    65% {
      transform: scale(1.4);
      box-shadow: rgba(0, 0, 0, 0) 0px 0 0 0;
    }
    100% {
      transform: scale(1);
      box-shadow: rgba(0, 0, 0, 0.5) 0px 10px 10px 0,
        inset rgba(205, 155, 255, 0.5) 0px 5px 10px -7px;
    }
  }

  @keyframes color-change {
    0% {
      fill: var(--logo-color);
    }
    50% {
      fill: white;
    }
    100% {
      fill: var(--logo-color);
    }
  }
`

const Loader = () => {
  return (
    <StyledWrapper>
      <div className='loader'>
        <div style={{ '--i': 1, '--inset': '44%' }} className='box'>
          <div className='logo scale-150'>
            <img src='/public/5188399.png' />
          </div>
        </div>
        <div style={{ '--i': 2, '--inset': '40%' }} className='box' />
        <div style={{ '--i': 3, '--inset': '36%' }} className='box' />
        <div style={{ '--i': 4, '--inset': '32%' }} className='box' />
        <div style={{ '--i': 5, '--inset': '28%' }} className='box' />
        <div style={{ '--i': 6, '--inset': '24%' }} className='box' />
        <div style={{ '--i': 7, '--inset': '20%' }} className='box' />
        <div style={{ '--i': 8, '--inset': '16%' }} className='box' />
      </div>
    </StyledWrapper>
  )
}

export default Loader