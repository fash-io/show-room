import { useState, useEffect } from 'react'
import { BiSolidRightArrow } from 'react-icons/bi'
import { fetchData } from '../../utils/tmdbfetch'
import { TiTick } from 'react-icons/ti'

const ServiceProvider = ({
  selectedProviders,
  setSelectedProviders,
  type_,
  openedModal,
  setOpenedModal,
  setWatchRegion
}) => {
  const [regions, setRegions] = useState([])
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [searchCountryQuery, setSearchCountryQuery] = useState('')
  const [watchProviders, setWatchProviders] = useState([])
  const [region, setRegion] = useState(localStorage.getItem('region') || '')

  useEffect(() => {
    fetchData({
      url: 'https://api.themoviedb.org/3/watch/providers/regions?language=en-US',
      setData: setRegions
    })

    fetchData({
      url: `https://api.themoviedb.org/3/watch/providers/${type_}?language=en-US${
        region && `&watch_region=${region}`
      }`,
      setData: setWatchProviders
    })

    localStorage.setItem('region', region)
  }, [region])

  const handleProviderToggle = provider => {
    setSelectedProviders(prev =>
      prev.some(p => p === provider.provider_id)
        ? prev.filter(p => p !== provider.provider_id)
        : [...prev, provider.provider_id]
    )
  }

  const filteredCountries = regions.filter(country =>
    country.english_name
      .toLowerCase()
      .includes(searchCountryQuery.toLowerCase())
  )

  useEffect(() => {
    if (selectedProviders.length > 0) {
      setWatchRegion(region)
    } else {
      setWatchRegion('')
    }
  }, [selectedProviders])

  return (
    <div className={`bg-slate-900 shadow-lg rounded`}>
      <div className='space-y-4 p-4'>
        {/* Header */}
        <div className='space-y-5 relative'>
          <div
            className='flex items-center justify-between cursor-pointer text-slate-300'
            onClick={() =>
              setOpenedModal(prev => (prev !== 'provider' ? 'provider' : ''))
            }
          >
            <span className='font-medium text-sm'>Watch Provider</span>
            <BiSolidRightArrow
              className={`duration-300 transform ${
                openedModal === 'provider' && 'rotate-90'
              }`}
            />
          </div>

          {/* Dropdown for Regions */}
          {isDropdownOpen && openedModal === 'provider' && (
            <>
              <div
                className='fixed top-0 left-0 h-screen w-screen'
                onClick={() => {
                  setIsDropdownOpen(false)
                  setSearchCountryQuery('')
                }}
              ></div>

              {/* Country Selection Dropdown */}
              <div className='absolute top-12 left-0 w-full bg-slate-900 border border-slate-800 shadow-lg rounded z-10'>
                <input
                  type='text'
                  placeholder='Search countries...'
                  value={searchCountryQuery}
                  onChange={e => setSearchCountryQuery(e.target.value)}
                  className='w-full px-4 py-2 text-sm bg-slate-800 text-white outline-none placeholder:text-slate-500'
                />
                <div className='max-h-40 overflow-y-auto'>
                  {filteredCountries.length > 0 ? (
                    filteredCountries.map(country => (
                      <div
                        key={country.iso_3166_1}
                        className='px-4 py-2 hover:bg-slate-700 cursor-pointer text-sm text-white flex items-center gap-2'
                        onClick={() => {
                          setRegion(country.iso_3166_1)

                          setIsDropdownOpen(false)
                          setSearchCountryQuery('')
                        }}
                      >
                        <img
                          src={`https://flagcdn.com/w40/${country.iso_3166_1.toLowerCase()}.png`}
                          alt={`${country.english_name} flag`}
                          className='w-5 h-3 rounded-sm'
                        />
                        <span>{country.english_name}</span>
                      </div>
                    ))
                  ) : (
                    <div className='px-4 py-2 text-sm text-slate-500'>
                      No countries found
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Watch Providers */}
        {openedModal === 'provider' && (
          <div className='space-y-4'>
            {/* Country Selector */}
            <div className='w-full'>
              <label className='text-xs text-slate-400'>Country</label>
              <div
                className='bg-slate-800 px-4 py-2 flex items-center justify-between text-sm text-slate-300 cursor-pointer rounded'
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                <span className='flex items-center gap-2'>
                  <img
                    src={`https://flagcdn.com/w40/${region.toLowerCase()}.png`}
                    alt={`${region} flag`}
                    className='w-5 h-3 rounded-sm'
                  />
                  <span>{region ? region : 'Select a country'}</span>
                </span>
                <BiSolidRightArrow
                  className={`transition-transform duration-300 ${
                    isDropdownOpen ? 'rotate-90' : ''
                  }`}
                />
              </div>
            </div>

            {/* Providers Grid (Responsive) */}
            <div className='grid grid-cols-4 lg:grid-cols-5 gap-2 max-h-60 overflow-y-auto'>
              {watchProviders.map(provider => (
                <button
                  key={provider.provider_id}
                  onClick={() => handleProviderToggle(provider)}
                  className='relative group'
                >
                  <div
                    className={`absolute inset-0 flex justify-center items-center rounded transition-all z-20 duration-300 ${
                      selectedProviders.includes(Number(provider.provider_id))
                        ? 'bg-blue-700/70 text-white'
                        : 'bg-transparent  group-hover:bg-blue-700/40'
                    }`}
                  >
                    {selectedProviders.includes(
                      Number(provider.provider_id)
                    ) && <TiTick />}
                  </div>
                  <img
                    src={`https://image.tmdb.org/t/p/w154/${provider.logo_path}`}
                    alt={provider.provider_name}
                    className='w-full h-full rounded'
                  />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ServiceProvider
