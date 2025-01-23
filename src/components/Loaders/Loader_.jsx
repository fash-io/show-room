const Loader_ = ({ className }) => (
  <div
    className={`flex justify-center items-center h-full w-full ${className}`}
  >
    <div
      className='border-l-transparent border-white animate-spin inline-block w-6 aspect-square border-2 rounded-full'
      role='status'
    >
      <span className='visually-hidden' />
    </div>
  </div>
)

export default Loader_
