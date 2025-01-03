import { useEffect, useState } from 'react'
import { login, signup } from '../utils/firebase'
import { toast } from 'react-toastify'
import { Link, useNavigate } from 'react-router-dom'
import { RxEyeOpen, RxEyeClosed, RxCrossCircled } from 'react-icons/rx'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import Loader_ from '../components/Loader_'
import PosterBackground from '../components/poster-background/PosterBackground'
const Login = props => {
  const { setIsExploring } = props
  const [signState, setSignState] = useState('Login')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [selectedShow, setSelectedShow] = useState({})
  const [nextPath, setNextPath] = useState('/')
  const navigator = useNavigate()
  const handleSignState = () => {
    setSignState(prevState => (prevState === 'Sign Up' ? 'Login' : 'Sign Up'))
    formik.resetForm()
  }
  const validationSchema = Yup.object({
    name:
      signState === 'Sign Up'
        ? Yup.string().required('Please enter your name')
        : Yup.string(),
    email: Yup.string()
      .email('Invalid email address')
      .required('Please enter your email'),
    password: Yup.string()
      .min(8, 'Password must be at least 8 characters long')
      .max(20, 'Password must be less than 20 characters long')
      .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
      .matches(/[0-9]/, 'Password must contain at least one number')
      .required('Please enter your password'),
    c_password:
      signState === 'Sign Up'
        ? Yup.string()
            .oneOf([Yup.ref('password'), null], 'Passwords do not match')
            .required('Please confirm your password')
        : Yup.string()
  })
  const formik = useFormik({
    initialValues: { name: '', email: '', password: '', c_password: '' },
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      setLoading(true)
      try {
        if (signState === 'Sign Up') {
          await signup(values.name, values.email, values.password)
          toast.success('Sign up successful.')
          navigator(nextPath)
        } else {
          await login(values.email, values.password)
          toast.success('Login successful.')
          nextPath ? navigator(nextPath) : navigator(-1)
        }
        resetForm()
      } catch (error) {
        setError(error.message)
      } finally {
        setLoading(false)
      }
    }
  })
  const handleExploring = () => {
    setIsExploring(true)
    navigator(nextPath || '/')
  }
  const handleShowSelect = movie => {
    setSelectedShow(movie)
    setNextPath(`/${movie.media_type}/${movie.id}`)
  }
  useEffect(() => {
    formik.resetForm()
    setError('')
  }, [signState])
  return (
    <>
      <PosterBackground
        className='fixed top-0 bottom-0 w-screen h-screen overflow-hidden'
        handleShowSelect={handleShowSelect}
      />
      <div className='h-screen py-5 lg:px-[8%] px-2 bg-gradient flex'>
        <div className='w-full relative max-w-md transition-all duration-500 overflow-hidden bg-black bg-opacity-75 rounded-2xl shadow-white/10 shadow-lg py-16 px-10 sm:p-16 m-auto backdrop-blur-sm flex'>
          <div
            className={`max-w-md md:w-[20rem] flex flex-col justify-center translate-y-[10%] transition-transform duration-500 absolute ${
              signState === 'Login' ? 'translate-x-0' : '-translate-x-[150%]'
            }`}
          >
            <div className='flex items-center justify-between mb-7'>
              <h1 className='text-3xl font-medium'>Login</h1>
              {(selectedShow.name || selectedShow.title) && (
                <p className='text-xs text-slate-500 max-w-[60%]'>
                  Redirect: {selectedShow.name || selectedShow.title}
                </p>
              )}
            </div>
            <form onSubmit={formik.handleSubmit} className='space-y-5'>
              <div className='relative w-full txt_field backdrop-blur-sm text-white font-medium'>
                <input
                  id='email'
                  name='email'
                  type='email'
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.email}
                  className='w-full h-full py-4 px-5 rounded bg-white/15'
                  placeholder='johndoe@gmail.com'
                />
                {formik.touched.email && formik.errors.email && (
                  <div className='text-red-500'>{formik.errors.email}</div>
                )}
              </div>
              <div className='relative w-full backdrop-blur-sm text-white font-medium'>
                <input
                  id='password'
                  name='password'
                  type={formik.values.showPassword ? 'text' : 'password'}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.password}
                  className='w-full h-full py-4 px-5 rounded bg-white/15'
                  placeholder='******'
                />
                <button
                  type='button'
                  onClick={() =>
                    formik.setFieldValue(
                      'showPassword',
                      !formik.values.showPassword
                    )
                  }
                  className='absolute right-3 top-1/2 transform -translate-y-1/2 text-white/50'
                >
                  {formik.values.showPassword ? <RxEyeOpen /> : <RxEyeClosed />}
                </button>
                {formik.touched.password && formik.errors.password && (
                  <div className='text-red-500'>{formik.errors.password}</div>
                )}
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
                <p className='text-sm'>
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
            <div className='flex items-center justify-between mb-7'>
              <h1 className='md:text-3xl font-medium'>Sign Up</h1>
              {(selectedShow.name || selectedShow.title) && (
                <p className='text-xs text-slate-500 max-w-[60%]'>
                  Redirect: {selectedShow.name || selectedShow.title}
                </p>
              )}
            </div>
            <form onSubmit={formik.handleSubmit} className='space-y-5'>
              <div className='relative w-full txt_field backdrop-blur-sm text-white font-medium'>
                <input
                  id='name'
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.name}
                  type='text'
                  className='w-full h-full py-4 px-5 rounded bg-white/15'
                  placeholder='John Doe'
                />
                {formik.touched.name && formik.errors.name && (
                  <div className='text-red-500'>{formik.errors.name}</div>
                )}
              </div>

              <div className='relative w-full txt_field backdrop-blur-sm text-white font-medium'>
                <input
                  id='email'
                  name='email'
                  type='email'
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.email}
                  className='w-full h-full py-4 px-5 rounded bg-white/15'
                  placeholder='Johndoe@gmail.com'
                />
                {formik.touched.email && formik.errors.email && (
                  <div className='text-red-500'>{formik.errors.email}</div>
                )}
              </div>

              <div className='relative w-full txt_field backdrop-blur-sm text-white font-medium'>
                <input
                  id='password'
                  name='password'
                  type={formik.values.showPassword ? 'text' : 'password'}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.password}
                  className='w-full h-full py-4 px-5 rounded bg-white/15'
                  placeholder='******'
                />
                <button
                  type='button'
                  onClick={() =>
                    formik.setFieldValue(
                      'showPassword',
                      !formik.values.showPassword
                    )
                  }
                  className='absolute right-3 top-1/2 transform -translate-y-1/2 text-white/50'
                >
                  {formik.values.showPassword ? <RxEyeOpen /> : <RxEyeClosed />}
                </button>
                {formik.touched.password && formik.errors.password && (
                  <div className='text-red-500'>{formik.errors.password}</div>
                )}
              </div>

              <div className='relative w-full txt_field backdrop-blur-sm text-white font-medium'>
                <input
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.c_password}
                  type='password'
                  id='c_password'
                  className='w-full h-full py-4 px-5 rounded bg-white/15'
                  placeholder='******'
                />
                {formik.touched.c_password && formik.errors.c_password && (
                  <div className='text-red-500'>{formik.errors.c_password}</div>
                )}
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
                  Already have an account?
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
