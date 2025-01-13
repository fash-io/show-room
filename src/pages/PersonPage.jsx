import { useState, useEffect } from 'react'
import axios from 'axios'
import { options } from '../utils/api'
import { LuLink } from 'react-icons/lu'
import { actorDetails, actorLinks } from '../constants'
import Loading from '../components/Loaders/Loading'
import {
  FaFacebook,
  FaImdb,
  FaInstagram,
  FaTiktok,
  FaTwitter,
  FaYoutube
} from 'react-icons/fa'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import 'swiper/css/effect-coverflow'
import 'swiper/css/pagination'
import { Pagination } from 'swiper/modules'
import { Link, useParams } from 'react-router-dom'
import Filmography from '../components/Filmography'
import Error from '../components/Error'

const Profile = () => {
  const { id } = useParams()
  const [profile, setProfile] = useState(null)
  const [credits, setCredits] = useState({ cast: [], crew: [] }) // Separate cast and crew
  const [images, setImages] = useState([])
  const [externalIds, setExternalIds] = useState({})
  const [showModal, setShowModal] = useState(false)
  const [ranking, setRanking] = useState(null)
  const [knownFor, setKnownFor] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      try {
        const profileRes = await axios.get(
          `https://api.themoviedb.org/3/person/${id}`,
          options
        )
        const creditsRes = await axios.get(
          `https://api.themoviedb.org/3/person/${id}/combined_credits`,
          options
        )
        const imagesRes = await axios.get(
          `https://api.themoviedb.org/3/person/${id}/images`,
          options
        )
        const externalIdsRes = await axios.get(
          `https://api.themoviedb.org/3/person/${id}/external_ids`,
          options
        )

        setProfile(profileRes.data)
        setCredits(creditsRes.data)
        setImages(imagesRes.data.profiles)
        setExternalIds(externalIdsRes.data)

        for (let page = 1; page <= 500; page++) {
          const popularRes = await axios.get(
            `https://api.themoviedb.org/3/person/popular?language=en-US&page=${page}`,
            options
          )
          const result = popularRes.data.results.find(
            person => person.id === parseInt(id, 10)
          )
          if (result) {
            setRanking(
              (page - 1) * 20 + popularRes.data.results.indexOf(result) + 1
            )
            setKnownFor(result.known_for)
            break
          }
        }
      } catch (error) {
        console.error(error)
        setError(error)
      }
    }

    fetchData()
  }, [id])

  const formatDate = dateStr => {
    if (!dateStr) return 'N/A'
    const date = new Date(dateStr)
    const options = { day: 'numeric', month: 'long', year: 'numeric' }
    return date.toLocaleDateString(undefined, options)
  }

  const calculateAge = dateStr => {
    if (!dateStr) return 'N/A'
    const birthDate = new Date(dateStr)
    const ageDiffMs = Date.now() - birthDate.getTime()
    const ageDate = new Date(ageDiffMs)
    return Math.abs(ageDate.getUTCFullYear() - 1970)
  }

  const linkIcons = {
    imdb_id: <FaImdb />,
    tiktok_id: <FaTiktok />,
    youtube_id: <FaYoutube />,
    facebook_id: <FaFacebook />,
    instagram_id: <FaInstagram />,
    twitter_id: <FaTwitter />
  }

  if (!profile) return <Loading />
  if (error) return <Error />

  return (
    <div className='text-white px-4 min-h-screen'>
      <div className='max-w-7xl mx-auto pt-7 md:py-20'>
        <div className='grid grid-cols-1 lg:grid-cols-8 gap-8'>
          <div className='lg:col-span-2 space-y-8'>
            <div className='space-y-4'>
              <img
                className='w-full object-cover rounded-xl max-w-sm'
                src={`https://image.tmdb.org/t/p/w500${profile.profile_path}`}
                alt={profile.name}
              />
              <div className='flex flex-wrap gap-5'>
                <div className='flex gap-3 text-2xl'>
                  {actorLinks.map(
                    link =>
                      externalIds[link.name] && (
                        <a
                          key={link.name}
                          target='_blank'
                          rel='noopener noreferrer'
                          className='transition-transform transform hover:scale-110'
                          href={`${link.href}${externalIds[link.name]}`}
                        >
                          {linkIcons[link.name]}
                        </a>
                      )
                  )}
                </div>
                {profile.homepage && (
                  <a
                    href={profile.homepage}
                    className='border-l-2 border-blue-500 text-blue-500 flex items-center pl-4 hover:underline'
                  >
                    <LuLink />
                  </a>
                )}
              </div>
            </div>
            <div className='sticky top-28 space-y-8'>
              <div className='bg-white/10 p-4 rounded-xl space-y-3 '>
                <h2 className='text-2xl font-bold mb-2'>Personal Info</h2>
                {actorDetails.map(detail => (
                  <p key={detail.path || detail.detail}>
                    <strong>{detail.label}</strong>
                    <span className='block text-sm text-white/70'>
                      {detail.path
                        ? detail.path === 'birthday'
                          ? `${formatDate(profile.birthday)} (${calculateAge(
                              profile.birthday
                            )} years old)`
                          : detail.path === 'gender'
                          ? profile[detail.path] === 1
                            ? 'Female'
                            : 'Male'
                          : detail.path === 'also_known_as'
                          ? profile[detail.path].join(', ')
                          : profile[detail.path]
                        : profile.known_for_department === 'Acting'
                        ? credits.cast.length
                        : credits.crew.length}
                    </span>
                  </p>
                ))}
              </div>
              {ranking && (
                <Link
                  to={'/top-people'}
                  className='bg-blue-500 text-white p-4 rounded-xl block'
                >
                  <h2 className='text-xl font-bold'>
                    Ranking in TMDB's Top Popular People: #{ranking}
                  </h2>
                </Link>
              )}
            </div>
          </div>

          {/* Right Section */}
          <div className='lg:col-span-6 space-y-8'>
            <div className='bg-white/10 p-6 rounded-xl'>
              <h1 className='text-4xl font-bold mb-4'>{profile.name}</h1>
              <p>
                {showModal
                  ? profile.biography
                  : profile.biography.length > 999
                  ? profile.biography.slice(0, 1000)
                  : profile.biography}

                {profile.biography.length > 999 && (
                  <button
                    onClick={() => setShowModal(prev => !prev)}
                    className='underline text-blue-300'
                  >
                    {showModal ? 'Show less' : '...  Show more'}
                  </button>
                )}
              </p>
            </div>
            <div className='flex gap-4 flex-col md:flex-row'>
              <div className='md:w-1/2 w-full bg-white/10 px-6 pt-2 rounded-xl'>
                <h2 className='text-3xl font-semibold mb-4'>Known For</h2>
                <div className='flex gap-1'>
                  {/* Display Known For */}
                  {knownFor.map(credit => (
                    <div key={credit.id}>
                      <Link
                        to={`/${
                          credit.media_type === 'tv'
                            ? 'series'
                            : credit.media_type
                        }/${credit.id}`}
                        className='overflow-hidden hover:z-[99]'
                      >
                        <img
                          className=' w-full md:hover:scale-125  object-cover transform-gpu duration-150'
                          src={`https://image.tmdb.org/t/p/w500${credit.poster_path}`}
                          alt={credit.title || credit.name}
                        />
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
              <div className='md:w-1/2 w-full bg-white/10 px-6 pt-2 rounded-xl'>
                <h2 className='text-3xl font-semibold mb-4'>Other Images</h2>
                <Swiper
                  grabCursor={true}
                  loop={true}
                  centeredSlides={true}
                  spaceBetween={30}
                  slidesPerView={3}
                  pagination={{ clickable: true }}
                  modules={[Pagination]}
                  className='mySwiper'
                >
                  {/* Display Known For */}
                  {images.map(credit => (
                    <SwiperSlide key={credit.id} className='pb-10'>
                      <Link
                        to={`/${
                          credit.media_type === 'tv'
                            ? 'series'
                            : credit.media_type
                        }/${credit.id}`}
                      >
                        <img
                          className=' w-full object-cover rounded-lg'
                          src={`https://image.tmdb.org/t/p/w500${credit.file_path}`}
                          alt={credit.title || credit.name}
                        />
                      </Link>
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>
            </div>

            {/* Filmography */}
            <Filmography credits={credits} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile
