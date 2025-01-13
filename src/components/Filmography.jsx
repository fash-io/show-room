import { Link } from 'react-router-dom'

const Filmography = ({ credits }) => {
  const getReleaseDate = credit =>
    credit.media_type === 'tv' ? credit.first_air_date : credit.release_date

  const sortCreditsByYear = credits =>
    credits.reduce((acc, credit) => {
      const year =
        credit.release_date?.slice(0, 4) || credit.first_air_date?.slice(0, 4)
      acc[year] = [...(acc[year] || []), credit]
      return acc
    }, {})

  // Use the cast and crew arrays
  const sortedMovies = sortCreditsByYear(
    [...credits.cast, ...credits.crew].filter(
      credit => credit.media_type === 'movie'
    )
  )
  const sortedSeries = sortCreditsByYear(
    [...credits.cast, ...credits.crew].filter(
      credit => credit.media_type === 'tv'
    )
  )

  const sortedYears = Array.from(
    new Set([...Object.keys(sortedMovies), ...Object.keys(sortedSeries)])
  ).sort((a, b) => b - a)

  const renderCredit = credit => {
    const releaseDate = getReleaseDate(credit) || 'TBA'
    const title = credit.title || credit.name
    const truncatedTitle =
      title.length > 30 ? `${title.slice(0, 27)}...` : title

    return (
      <Link
        to={`/${credit.media_type === 'tv' ? 'series' : credit.media_type}/${
          credit.id
        }`}
        key={credit.id}
        className='flex items-center space-x-2 px-2 py-1 md:hover:bg-gray-600/30 duration-200 rounded'
      >
        <img
          src={
            credit.poster_path
              ? `https://image.tmdb.org/t/p/w200${credit.poster_path}`
              : 'https://via.placeholder.com/150x225?text=No+Image'
          }
          alt={title}
          className='w-10 h-14 object-cover rounded-sm'
        />
        <div>
          <h3 className='text-sm font-medium'>{truncatedTitle}</h3>
          <p className='text-xs text-gray-400'>
            {credit.character || credit.job || 'No role'}
          </p>
          <p className='text-xs text-gray-500'>{releaseDate}</p>
        </div>
      </Link>
    )
  }

  return (
    <div className='text-white p-4 space-y-6 sticky top-24 bg-white/10 rounded-xl'>
      <div className='space-x-3 w-full justify-between  bg-gray-600/30 backdrop-blur-lg p-3 rounded-xl hidden md:flex'>
        <span className='px-3 py-1 rounded text-sm  text-gray-300'>Movies</span>
        <span className='w-1/2'>
          <span className='px-3  py-1 rounded text-sm  text-gray-300'>
            Series
          </span>
        </span>
      </div>

      <div className='flex space-x-8 mt-6'>
        <div className='w-full'>
          {sortedYears.map(year => (
            <div key={year} className='mb-6'>
              <h2 className='text-lg font-semibold'>{year}</h2>
              <div className='flex flex-col md:flex-row md:space-x-8'>
                <div className='md:w-1/2'>
                  <span className='md:hidden mt-1 text-center  rounded-xl block max-w-fit ms-auto underline text-white/50'>
                    Movies
                  </span>
                  {sortedMovies[year] && sortedMovies[year].length > 0 ? (
                    <ul className='space-y-2 mt-2'>
                      {sortedMovies[year]
                        .sort(
                          (a, b) =>
                            new Date(b.release_date) - new Date(a.release_date)
                        )
                        .map(renderCredit)}
                    </ul>
                  ) : (
                    <div className='text-gray-400'>No movies this year</div>
                  )}
                </div>
                <div className='md:w-1/2'>
                  <span className='md:hidden mt-1 text-center  rounded-xl block max-w-fit ms-auto underline text-white/50'>
                    Series
                  </span>
                  {sortedSeries[year] && sortedSeries[year].length > 0 ? (
                    <ul className='space-y-2 mt-2'>
                      {sortedSeries[year]
                        .sort(
                          (a, b) =>
                            new Date(b.first_air_date) -
                            new Date(a.first_air_date)
                        )
                        .map(renderCredit)}
                    </ul>
                  ) : (
                    <div className='text-gray-400'>No series this year</div>
                  )}
                </div>

                {/* Movies Column */}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Filmography
