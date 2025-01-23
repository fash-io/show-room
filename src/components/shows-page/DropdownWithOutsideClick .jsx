import { useEffect, useRef } from 'react'

const DropdownWithOutsideClick = ({
  isOpen,
  setIsOpen,
  children,
  className
}) => {
  const dropdownRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = event => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen, setIsOpen])

  return (
    <div ref={dropdownRef} className={className}>
      {children}
    </div>
  )
}
export default DropdownWithOutsideClick
