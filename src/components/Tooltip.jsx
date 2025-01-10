const Tooltip = ({ message, children, ...props }) => {
  return (
    <div className={`relative inline-block group`}>
      {children}
      <div
        {...props}
        className='absolute invisible opacity-0 group-hover:visible group-hover:opacity-100 bottom-full left-1/2 -translate-x-1/2 mb-2 transition-all duration-300 ease-in-out'
      >
        <div className='relative px-4 py-2 text-sm text-white bg-gray-900 rounded-lg backdrop-blur-sm bg-opacity-90 border border-gray-700/50 shadow-xl'>
          <span>{message}</span>
          <div className='absolute left-1/2 -translate-x-1/2 -bottom-1 w-2 h-2 bg-gray-900 border-r border-b border-gray-700/50 transform rotate-45'></div>
        </div>
      </div>
    </div>
  )
}

export default Tooltip
