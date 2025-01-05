import { useState, useEffect } from 'react'
import axios from 'axios'
import { Carousel } from 'react-responsive-carousel'
import 'react-responsive-carousel/lib/styles/carousel.min.css'
import { FaImdb, FaFacebook, FaInstagram, FaTwitter } from 'react-icons/fa'
import 'animate.css'
import { options } from '../utils/api'
import { BiLinkExternal } from 'react-icons/bi'
import { LuLink } from 'react-icons/lu'

const Profile = () => {
  const [profile, setProfile] = useState(null)
  const [credits, setCredits] = useState([])
  const [taggedImages, setTaggedImages] = useState([])
  const [externalIds, setExternalIds] = useState({})
  const [tvCredits, setTvCredits] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedCredit, setSelectedCredit] = useState(null)
  const [filter, setFilter] = useState('all')

  const personId = 226001 // Replace with the actual person ID

  useEffect(() => {
    const fetchData = async () => {
      try {
        const profileRes = await axios.get(
          `https://api.themoviedb.org/3/person/${personId}`,
          options
        )
        const creditsRes = await axios.get(
          `https://api.themoviedb.org/3/person/${personId}/movie_credits`,
          options
        )
        const tvCreditsRes = await axios.get(
          `https://api.themoviedb.org/3/person/${personId}/tv_credits`,
          options
        )
        const taggedImagesRes = await axios.get(
          `https://api.themoviedb.org/3/person/${personId}/tagged_images`,
          options
        )
        const externalIdsRes = await axios.get(
          `https://api.themoviedb.org/3/person/${personId}/external_ids`,
          options
        )

        setProfile(profileRes.data)
        setCredits(creditsRes.data.cast)
        setTvCredits(tvCreditsRes.data.cast)
        setTaggedImages(taggedImagesRes.data.results)
        setExternalIds(externalIdsRes.data)
      } catch (error) {
        console.error(error)
      }
    }

    fetchData()
  }, [personId])

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

  const handleOpenModal = credit => {
    setSelectedCredit(credit)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedCredit(null)
  }

  const filteredCredits = credits.concat(tvCredits).filter(credit => {
    if (filter === 'all') return true
    if (filter === 'acting' && credit.character) return true
    if (filter === 'directing' && credit.job === 'Director') return true
    return false
  })

  if (!profile) return <div>Loading...</div>

  return (
    <div className='bg-gray-900 text-white p-4 min-h-screen'>
      <div className='max-w-7xl mx-auto pt-20'>
        <div className='grid grid-cols-1 md:grid-cols-8 gap-8'>
          <div className='md:col-span-2 space-y-8'>
            <div className='space-y-4'>
              <img
                className='w-full object-cover rounded-lg'
                src={`https://image.tmdb.org/t/p/w500${profile.profile_path}`}
                alt={profile.name}
              />
              <div className='flex gap-10'>
                <div className=' flex gap-3 w-3/4 text-2xl'>
                  <a
                    className='transition-transform'
                    href={`https://www.imdb.com/name/${externalIds.imdb_id}`}
                    target='_blank'
                    rel='noopener noreferrer'
                  >
                    <FaImdb />
                  </a>
                  <a
                    className='transition-transform'
                    href={`https://www.facebook.com/${externalIds.facebook_id}`}
                    target='_blank'
                    rel='noopener noreferrer'
                  >
                    <FaFacebook />
                  </a>
                  <a
                    className='transition-transform'
                    href={`https://www.instagram.com/${externalIds.instagram_id}`}
                    target='_blank'
                    rel='noopener noreferrer'
                  >
                    <FaInstagram />
                  </a>
                  <a
                    className='transition-transform'
                    href={`https://twitter.com/${externalIds.twitter_id}`}
                    target='_blank'
                    rel='noopener noreferrer'
                  >
                    <FaTwitter />
                  </a>
                </div>
                <a href={profile.homepage}>
                  <LuLink />
                </a>
              </div>
            </div>
            <div className='bg-black/80 p-4 rounded-lg space-y-3'>
              <h2 className='text-2xl font-bold mb-2'>Personal Info</h2>
              <p>
                <strong>Known For:</strong>
                <span className='block text-sm text-white/70'>
                  {profile.known_for_department}
                </span>
              </p>
              <p>
                <strong>Known Credits:</strong>
                <span className='block text-sm text-white/70'>
                  {credits.length + tvCredits.length}
                </span>
              </p>
              <p>
                <strong>Gender:</strong>
                <span className='block text-sm text-white/70'>
                  {profile.gender === 1 ? 'Female' : 'Male'}
                </span>
              </p>
              <p>
                <strong>Birthdate:</strong>
                <span className='block text-sm text-white/70'>
                  {formatDate(profile.birthday)} (
                  {calculateAge(profile.birthday)} years old)
                </span>
              </p>
              <p>
                <strong>Place of Birth:</strong>
                <span className='block text-sm text-white/70'>
                  {profile.place_of_birth}
                </span>
              </p>
              <p>
                <strong>Also known as</strong>
                <span className='block text-sm text-white/70'>
                  {profile.also_known_as}
                </span>
              </p>
            </div>
          </div>
          <div className='md:col-span-6 space-y-8'>
            <div className='bg-gray-800 p-6 rounded-lg'>
              <h1 className='text-4xl font-bold mb-4'>{profile.name}</h1>
              <p>{profile.biography}</p>
            </div>

            <div className='bg-gray-800 p-6 rounded-lg'>
              <h2 className='text-3xl font-semibold mb-4'>Known For</h2>
              <Carousel showThumbs={false} showStatus={false} useKeyboardArrows>
                {credits
                  .concat(tvCredits)
                  .slice(0, 10)
                  .map(credit => (
                    <div key={credit.id}>
                      <img
                        className='w-32 object-cover h-40 rounded-lg'
                        src={`https://image.tmdb.org/t/p/w200${credit.poster_path}`}
                        alt={credit.title || credit.name}
                      />
                      <p className='legend'>{credit.title || credit.name}</p>
                    </div>
                  ))}
              </Carousel>
            </div>

            <div className='bg-gray-800 p-6 rounded-lg'>
              <h2 className='text-3xl font-semibold mb-4'>Filmography</h2>
              <div className='space-y-4'>
                <div className='flex justify-between items-center'>
                  <h3 className='text-2xl font-bold'>Credits</h3>
                  <div>
                    <button
                      className='text-blue-500 hover:underline mr-4'
                      onClick={() => setFilter('acting')}
                    >
                      Acting
                    </button>
                    <button
                      className='text-blue-500 hover:underline'
                      onClick={() => setFilter('directing')}
                    >
                      Directing
                    </button>
                  </div>
                </div>
                <ul className='space-y-2'>
                  {filteredCredits.map(credit => (
                    <li
                      key={credit.id}
                      className='border-b border-gray-700 pb-2'
                    >
                      <button
                        onClick={() => handleOpenModal(credit)}
                        className='text-left w-full hover:bg-gray-700 p-2 rounded'
                      >
                        <div className='flex items-center space-x-4'>
                          <img
                            className='w-16 h-auto rounded-lg'
                            src={`https://image.tmdb.org/t/p/w200${credit.poster_path}`}
                            alt={credit.title || credit.name}
                          />
                          <div>
                            <strong>{credit.title || credit.name}</strong> (
                            {credit.release_date
                              ? credit.release_date.split('-')[0]
                              : 'N/A'}
                            ) <br />
                            <span className='text-sm text-gray-400'>
                              {credit.character}
                            </span>
                          </div>
                        </div>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className='bg-gray-800 p-6 rounded-lg'>
              <h2 className='text-3xl font-semibold mb-4'>Tagged Images</h2>
              <Carousel showThumbs={false} showStatus={false} useKeyboardArrows>
                {taggedImages.map(image => (
                  <div key={image.id}>
                    <img
                      className='w-32 h-auto rounded-lg mx-auto'
                      src={`https://image.tmdb.org/t/p/w200${image.file_path}`}
                      alt='Tagged'
                    />
                  </div>
                ))}
              </Carousel>
            </div>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50'>
          <div className='bg-gray-800 p-6 rounded-lg relative'>
            {selectedCredit && (
              <div>
                <button
                  className='absolute top-2 right-2 text-white'
                  onClick={handleCloseModal}
                >
                  X
                </button>
                <h2 className='text-2xl font-bold mb-4'>
                  {selectedCredit.title || selectedCredit.name}
                </h2>
                <p>
                  <strong>Release Date:</strong>{' '}
                  {selectedCredit.release_date || 'N/A'}
                </p>
                <p>
                  <strong>CharacterCharacter:</strong>{' '}
                  {selectedCredit.character || 'N/A'}
                </p>
                <p>
                  <strong>Overview:</strong> {selectedCredit.overview || 'N/A'}
                </p>
                <img
                  className='w-full h-auto rounded-lg mt-4'
                  src={`https://image.tmdb.org/t/p/w500${selectedCredit.poster_path}`}
                  alt={selectedCredit.title || selectedCredit.name}
                />
                <button
                  className='mt-4 p-2 bg-blue-500 hover:bg-blue-700 text-white rounded'
                  onClick={handleCloseModal}
                >
                  Close
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default Profile
