import { useContext, useState } from 'react'
import TitleCards from '../components/TitleCards'
import Slider from '../components/Slider'
import Error from '../components/Error'
import Loading from '../components/Loaders/Loading'
import UserContext from '../UserContext'
import { featured } from '../constants'

const Home = () => {
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { user } = useContext(UserContext)

  if (error) {
    return <Error error={error} />
  }

  return (
    <>
      {loading && <Loading transparent={true} />}
      {/* <Slider type='all' setLoading={setLoading} setError={setError} /> */}
      {!loading ? (
        <div className='pl-2 pr-1 sm:pl-10'>
          {featured.map((feature, i) => {
            const isWatchList = feature.userWatchList

            return isWatchList ? (
              user && (
                <TitleCards
                  key={i}
                  title_={feature.title}
                  userWatchList={feature.userWatchList}
                />
              )
            ) : (
              <TitleCards
                key={i}
                type_={feature.type || 'movie'}
                feature_={feature}
              />
            )
          })}
        </div>
      ) : (
        <div className='h-[100vh] w-full'></div>
      )}
    </>
  )
}

export default Home
