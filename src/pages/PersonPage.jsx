import { useState, useEffect } from 'react'
import axios from 'axios'
import { options } from '../utils/api'
import { LuLink } from 'react-icons/lu'
import { actorDetails, actorLinks } from '../constants'
import {
  FaFacebook,
  FaImdb,
  FaInstagram,
  FaTiktok,
  FaTwitter,
  FaYoutube
} from 'react-icons/fa'
import { fetchData } from '../utils/tmdbfetch'

const Profile = () => {
  const [profile, setProfile] = useState(null)
  const [credits, setCredits] = useState([])
  const [taggedImages, setTaggedImages] = useState([])
  const [externalIds, setExternalIds] = useState({})
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedCredit, setSelectedCredit] = useState(null)
  const [filter, setFilter] = useState('all')

  const personId = 226001

  useEffect(() => {
    const fetchData_ = async () => {
      try {
        fetchData()
        const profileRes = await axios.get(
          `https://api.themoviedb.org/3/person/${personId}`,
          options
        )
        const creditsRes = await axios.get(
          `https://api.themoviedb.org/3/person/${personId}/combined_credits`,
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
        setTaggedImages(taggedImagesRes.data.results)
        setExternalIds(externalIdsRes.data)
      } catch (error) {
        console.error(error)
      }
    }

    fetchData_()
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

  const filteredCredits = credits.filter(credit => {
    if (filter === 'all') return true
    if (filter === 'acting' && credit.character) return true
    if (filter === 'directing' && credit.job === 'Director') return true
    return false
  })
  const linkIcons = {
    imdb_id: <FaImdb />,
    tiktok_id: <FaTiktok />,
    youtube_id: <FaYoutube />,
    facebook_id: <FaFacebook />,
    instagram_id: <FaInstagram />,
    twitter_id: <FaTwitter />
  }
  console.log(externalIds)
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
              <div className='flex gap-5'>
                <div className=' flex gap-3 text-2xl'>
                  {actorLinks.map(
                    link =>
                      externalIds[link.name] && (
                        <a
                          key={link.name}
                          target='_blank'
                          rel='noopener noreferrer'
                          className='transition-transform'
                          href={`${link.href}${externalIds[link.name]}`}
                        >
                          {linkIcons[link.name]}
                        </a>
                      )
                  )}
                </div>
                <a
                  href={profile.homepage}
                  className='border-l-2 flex items-center pl-4'
                >
                  <LuLink />
                </a>
              </div>
            </div>
            <div className='bg-black/80 p-4 rounded-lg space-y-3'>
              <h2 className='text-2xl font-bold mb-2'>Personal Info</h2>
              {actorDetails.map(detail => (
                <p key={detail.path || detail.detail}>
                  <strong>{detail.label}</strong>
                  <span className='block text-sm text-white/70'>
                    {detail.path
                      ? detail.path === 'birthday'
                        ? `${formatDate(profile)} (${calculateAge(
                            profile.birthday
                          )} years old)`
                        : profile[detail.path]
                      : credits[detail.detail]}
                  </span>
                </p>
              ))}
            </div>
          </div>
          <div className='md:col-span-6 space-y-8'>
            <div className='bg-gray-800 p-6 rounded-lg'>
              <h1 className='text-4xl font-bold mb-4'>{profile.name}</h1>
              <p>{profile.biography}</p>
            </div>

            <div className='bg-gray-800 p-6 rounded-lg'>
              <h2 className='text-3xl font-semibold mb-4'>Known For</h2>
              {credits.slice(0, 10).map(credit => (
                <div key={credit.id}>
                  <img
                    className='w-32 object-cover h-40 rounded-lg'
                    src={`https://image.tmdb.org/t/p/w200${credit.poster_path}`}
                    alt={credit.title || credit.name}
                  />
                  <p className='legend'>{credit.title || credit.name}</p>
                </div>
              ))}
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
              {taggedImages.map(image => (
                <div key={image.id}>
                  <img
                    className='w-32 h-auto rounded-lg mx-auto'
                    src={`https://image.tmdb.org/t/p/w200${image.file_path}`}
                    alt='Tagged'
                  />
                </div>
              ))}
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
