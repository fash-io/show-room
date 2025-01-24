import { BiSolidRightArrow } from 'react-icons/bi'
import { moviesSortOptions, seriesSortOptions } from '../../constants'

const SortType = ({
  setSortOption,
  sortOption,
  openedModal,
  setOpenedModal,
  type_
}) => {
  const sortOptions = type_ === 'movie' ? moviesSortOptions : seriesSortOptions
  return (
    <div className={`bg-slate-900 shadow-lg rounded`}>
      {/* Sort Type Header for Larger Screens */}
      <div className='flex px-4 py-3 items-center justify-between md:hidden'>
        <span className='text-sm font-medium text-slate-300'>Sort by</span>
        <BiSolidRightArrow
          className={`duration-300 transform ${
            openedModal === 'sort' && 'rotate-90'
          }`}
          onClick={() =>
            setOpenedModal(prev => (prev !== 'sort' ? 'sort' : ''))
          }
        />
      </div>

      {/* Dropdown for Sort on Small Devices */}
      {openedModal === 'sort' && (
        <div className='md:hidden border-t border-slate-800 bg-slate-900 text-slate-200 text-xs rounded-b max-h-44 overflow-y-auto'>
          {sortOptions.map((option, i) => (
            <div
              key={i}
              onClick={() => setSortOption(option.key)}
              className={`px-4 py-2 hover:bg-slate-800 cursor-pointer ${
                sortOption === option.key ? 'bg-slate-800' : ''
              }`}
            >
              {option.label}
            </div>
          ))}
        </div>
      )}

      {/* Sort Type Dropdown for Larger Screens */}
      <div className='hidden md:block'>
        <div
          className='flex items-center justify-between px-4 py-3 cursor-pointer'
          onClick={() =>
            setOpenedModal(prev => (prev !== 'sort' ? 'sort' : ''))
          }
        >
          <span className='text-sm font-medium text-slate-300'>Sort by</span>
          <BiSolidRightArrow
            className={`duration-300 transform ${
              openedModal === 'sort' && 'rotate-90'
            }`}
          />
        </div>
        {openedModal === 'sort' && (
          <div className='border-t border-slate-800 bg-slate-900 text-slate-200 text-xs rounded-b max-h-44 overflow-y-auto'>
            {sortOptions.map((option, i) => (
              <div
                key={i}
                onClick={() => setSortOption(option.key)}
                className={`px-4 py-2 hover:bg-slate-800 cursor-pointer ${
                  sortOption === option.key ? 'bg-slate-800' : ''
                }`}
              >
                {option.label}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default SortType
