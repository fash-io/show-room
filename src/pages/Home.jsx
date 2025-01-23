import TitleCards from '../components/TitleCards'
import Slider from '../components/Slider'
import Error from '../components/Error'
import { useContext, useState } from 'react'
import UserContext from '../UserContext'
import Loading from '../components/Loaders/Loading'
import { featured } from '../constants'

const Home = () => {
  const [error, setError] = useState('')
  const { user } = useContext(UserContext)
  const [loading, setLoading] = useState(false)

  if (error) {
    return <Error error={error} />
  }
  return (
    <>
      {loading && <Loading transparent={true} />}
      <Slider
        height='max-h-[80vh] max-sm:min-h-[75vh]'
        type={'all'}
        setLoading={setLoading}
        setError={setError}
      />
      <div className='hidden justify-center items-center h-[200px] bg-gradient-to-r from-black via-blue-900 to-red-900 text-white relative overflow-hidden -z-10'>
        <div className='custom-shape-divider-top-1736542638'>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            viewBox='0 0 1200 120'
            preserveAspectRatio='none'
          >
            <path
              d='M985.66,92.83C906.67,72,823.78,31,743.84,14.19c-82.26-17.34-168.06-16.33-250.45.39-57.84,11.73-114,31.07-172,41.86A600.21,600.21,0,0,1,0,27.35V120H1200V95.8C1132.19,118.92,1055.71,111.31,985.66,92.83Z'
              className='shape-fill'
            ></path>
          </svg>
        </div>

        <div className='custom-shape-divider-bottom-1736543087'>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            viewBox='0 0 1200 120'
            preserveAspectRatio='none'
          >
            <path
              d='M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z'
              className='shape-fill'
            ></path>
          </svg>
        </div>
      </div>

      {!loading ? (
        <div className='pl-2 pr-1 sm:pl-10 '>
          {featured.map((feature, i) =>
            feature.userWatchList ? (
              user && (
                <TitleCards
                  key={i}
                  title={feature.title}
                  userWatchList={feature.userWatchList}
                />
              )
            ) : (
              <TitleCards
                key={i}
                title={feature.title}
                category={feature.category}
                type={feature.type}
                type_={feature.type || 'movie'}
                feature={feature.feature}
                url_={feature.url}
              />
            )
          )}
        </div>
      ) : (
        <div className='h-[100vh] w-full'></div>
      )}
    </>
  )
}

export default Home
