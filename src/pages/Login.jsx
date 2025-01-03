import { useEffect, useState } from 'react'
import { login, signup } from '../utils/firebase'
import { toast } from 'react-toastify'
import { Link, useNavigate } from 'react-router-dom'
import { RxEyeOpen, RxEyeClosed, RxExit, RxCrossCircled } from 'react-icons/rx'
import Loading from '../components/Loading'
import Loader_ from '../components/Loader_'
import PosterBackground from '../components/PosterBackground'

const Login = props => {
  const { setIsExploring } = props
  const [signState, setSignState] = useState('Login')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [c_password, setC_password] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigator = useNavigate()

  const handleNameChange = e => setName(e.target.value)
  const handleEmailChange = e => setEmail(e.target.value)
  const handlePasswordChange = e => setPassword(e.target.value)
  const handleC_passwordChange = e => setC_password(e.target.value)

  const handleSignState = () => {
    setSignState(prevState => (prevState === 'Sign Up' ? 'Login' : 'Sign Up'))
  }

  const user_auth = async event => {
    event.preventDefault()
    setLoading(true)

    try {
      if (signState === 'Sign Up') {
        if (name.trim().length < 1) {
          throw new Error('Please enter your name')
        }
        if (email.trim().length < 1) {
          throw new Error('Please enter your email')
        }
        if (password.trim().length < 8) {
          throw new Error('Password must be at least 8 characters long')
        }
        if (password.trim().length > 20) {
          throw new Error('Password must be less than 20 characters long')
        }
        if (!/[A-Z]/.test(password)) {
          throw new Error('Password must contain at least one uppercase letter')
        }
        if (!/[a-z]/.test(password)) {
          throw new Error('Password must contain at least one lowercase letter')
        }
        if (!/[0-9]/.test(password)) {
          throw new Error('Password must contain at least one number')
        }
        if (password !== c_password) {
          throw new Error('Passwords do not match')
        }
        await signup(name, email, password)
        toast.success('Sign up successful.')
        navigator('/login')
      } else {
        if (email.trim().length < 1) {
          setError('Please enter your email')
          return
        }
        if (password.trim().length < 1) {
          setError('Please enter your password')
          return
        }
        await login(email, password)
        toast.success('Login successful.')
        navigator('/')
      }
    } catch (error) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }
  const handleExploring = () => {
    setIsExploring(true)
    navigator('/')
  }

  useEffect(() => {
    setName('')
    setEmail('')
    setPassword('')
    setC_password('')
    setError('')
    setShowPassword(false)
  }, [signState])

  return (
    <>
      <PosterBackground />
      <div className='h-screen login py-5 lg:px-[8%] px-2 bg-gradient flex'>
        <Link to={'/'}>
          <span
            className='text-xl sm:text-4xl font-bold bg-clip-text text-transparent absolute'
            style={{
              backgroundImage: 'linear-gradient(to right, #ff7e5f, #1a2a6c)'
            }}
          >
            ShowRoom
          </span>
        </Link>
        <div className='w-full  relative max-w-md transition-all duration-500 overflow-hidden bg-black bg-opacity-75 rounded-2xl shadow-white/10 shadow-lg py-16 px-10 sm:p-16 m-auto backdrop-blur-sm'>
          <div
            className={`max-w-md w-[20rem] flex flex-col justify-center translate-y-[10%] transition-transform duration-500 absolute ${
              signState === 'Login' ? 'translate-x-0' : '-translate-x-[150%]'
            }`}
          >
            <h1 className='text-3xl font-medium mb-7'>Login</h1>
            <form onSubmit={user_auth} className='space-y-5'>
              <div className='relative w-full txt_field backdrop-blur-sm text-white font-medium'>
                <input
                  id='email'
                  value={email}
                  onChange={handleEmailChange}
                  type='email'
                  className='w-full h-full py-4 px-5 rounded bg-white/15'
                />
                <label
                  className='absolute bottom-[25%] left-5 duration-200 text-white/50'
                  htmlFor='email'
                >
                  Email
                </label>
              </div>

              <div className='relative w-full txt_field backdrop-blur-sm text-white font-medium'>
                <input
                  value={password}
                  onChange={handlePasswordChange}
                  type={showPassword ? 'text' : 'password'}
                  id='password'
                  className='w-full h-full py-4 px-5 rounded bg-white/15'
                />
                <label
                  className='absolute bottom-[25%] left-5 duration-200 3 text-white/50'
                  htmlFor='password'
                >
                  Password
                </label>
                <button
                  type='button'
                  onClick={() => setShowPassword(prev => !prev)}
                  className='absolute right-3 top-1/2 transform -translate-y-1/2 text-white/50'
                >
                  {showPassword ? <RxEyeOpen /> : <RxEyeClosed />}
                </button>
              </div>
              {error && (
                <div className='p-3 rounded-md flex item-center text-xs bg-red-600/50 text-white justify-between'>
                  <p>{error}</p>
                  <button onClick={() => setError('')}>
                    <RxCrossCircled className='text-base' />
                  </button>
                </div>
              )}
              <button
                className={`w-full p-4 bg-[#e50914] rounded text font-medium mt-7 duration-200 mb-2 cursor-pointer shadow shadow-white/30 active:bg-[#e50914] hover:bg-[#f6121d] ${
                  loading &&
                  'disabled:hover:bg-[#e50914]/70 disabled:bg-[#e50914]/70 cursor-wait'
                }`}
                type='submit'
                disabled={loading}
              >
                {loading ? <Loader_ /> : 'Login'}
              </button>
            </form>

            <div className='mt-10 text-[#737373]'>
              <div className='flex w-full justify-between items-center'>
                <p className='text-sm '>
                  <span
                    onClick={handleSignState}
                    className='ml-1.5 text-white/50 font-medium cursor-pointer'
                  >
                    New to ShowRoom?
                  </span>
                </p>
                <h2
                  className='font-medium cursor-pointer text-white'
                  onClick={handleExploring}
                >
                  Just exploring?
                </h2>
              </div>
            </div>
          </div>

          <div
            className={`w-full transition-transform duration-500 h-full  ${
              signState === 'Sign Up' ? 'translate-x-0' : 'translate-x-[150%]'
            }`}
          >
            <h1 className='text-3xl font-medium mb-7'>Sign Up</h1>
            <form onSubmit={user_auth} className='space-y-5'>
              <div className='relative w-full txt_field backdrop-blur-sm text-white font-medium'>
                <input
                  value={name}
                  id='name'
                  onChange={handleNameChange}
                  type='text'
                  className='w-full h-full py-4 px-5 rounded bg-white/15'
                />
                <label
                  className='absolute bottom-[25%] left-5 duration-200 text-white/50'
                  htmlFor='name'
                >
                  Username
                </label>
              </div>

              <div className='relative w-full txt_field backdrop-blur-sm text-white font-medium'>
                <input
                  id='email_'
                  value={email}
                  onChange={handleEmailChange}
                  type='email'
                  className='w-full h-full py-4 px-5 rounded bg-white/15'
                />
                <label
                  className='absolute bottom-[25%] left-5 duration-200 text-white/50'
                  htmlFor='email_'
                >
                  Email
                </label>
              </div>

              <div className='relative w-full txt_field backdrop-blur-sm text-white font-medium'>
                <input
                  value={password}
                  onChange={handlePasswordChange}
                  type={showPassword ? 'text' : 'password'}
                  id='password_'
                  className='w-full h-full py-4 px-5 rounded bg-white/15'
                />
                <label
                  className='absolute bottom-[25%] left-5 duration-200 3 text-white/50'
                  htmlFor='password_'
                >
                  Password
                </label>
                <button
                  type='button'
                  onClick={() => setShowPassword(prev => !prev)}
                  className='absolute right-3 top-1/2 transform -translate-y-1/2 text-white/50'
                >
                  {showPassword ? <RxEyeOpen /> : <RxEyeClosed />}
                </button>
              </div>

              <div className='relative w-full txt_field backdrop-blur-sm text-white font-medium'>
                <input
                  value={c_password}
                  onChange={handleC_passwordChange}
                  type='password'
                  id='c_password'
                  className='w-full h-full py-4 px-5 rounded bg-white/15'
                />
                <label
                  className='absolute bottom-[25%] left-5 duration-200 3 text-white/50'
                  htmlFor='c_password'
                >
                  Confirm password
                </label>
              </div>
              {error && (
                <div className='p-3 rounded-md flex item-center text-xs bg-red-600/50 text-white justify-between'>
                  <p>{error}</p>
                  <button onClick={() => setError('')}>
                    <RxCrossCircled className='text-base' />
                  </button>
                </div>
              )}

              <button
                className={`w-full p-4 bg-[#e50914] rounded text font-medium mt-5 mb-2 cursor-pointer shadow shadow-white/30 duration-200 active:bg-[#e50914] hover:bg-[#f6121d] ${
                  loading &&
                  'disabled:hover:bg-[#e50914]/70 disabled:bg-[#e50914]/70 cursor-wait'
                }`}
                type='submit'
                disabled={loading}
              >
                {loading ? <Loader_ /> : 'Create account'}
              </button>
            </form>

            <div className='mt-5 text-[#737373]'>
              <p>
                <span
                  onClick={handleSignState}
                  className='ml-1.5 text-white font-medium cursor-pointer'
                >
                  Already have an account?{' '}
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Login
