import TitleCards from '../components/TitleCards'
import Slider from '../components/Slider'
import Error from '../components/Error'
import { useContext, useState } from 'react'
import UserContext from '../UserContext'
import Loading from '../components/Loading'
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
        height='max-h-[70vh]  max-sm:min-h-[60vh]'
        type={'all'}
        setLoading={setLoading}
        setError={setError}
      />
      <div className='pl-2 pr-1 sm:pl-10 '>
        {featured.map((feature, i) =>
          feature.userWatchlist ? (
            user && (
              <TitleCards
                key={i}
                title={feature.title}
                userWatchlist={feature.userWatchlist}
              />
            )
          ) : (
            <TitleCards
              key={i}
              title={feature.title}
              category={feature.category}
              type={feature.type}
            />
          )
        )}
      </div>
    </>
  )
}

export default Home
