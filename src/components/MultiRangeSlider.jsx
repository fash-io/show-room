import React, { useEffect, useState } from 'react'

export const MultiRangeSlider = ({ min, max, onChange }) => {
  const [range, setRange] = useState({ min, max })

  const handleInputChange = e => {
    const { name, value } = e.target
    setRange(prev => ({ ...prev, [name]: parseInt(value, 10) }))
  }

  useEffect(() => {
    onChange(range)
  }, [range])

  return (
    <div className='space-y-3'>
      <div className='flex items-center text-xs space-x-3'>
        <span className='w-10 text-slate-400'>Min:</span>
        <input
          type='range'
          name='min'
          min={min}
          max={range.max}
          value={range.min}
          onChange={handleInputChange}
          className='flex-1 accent-blue-500 cursor-pointer'
        />
      </div>
      <div className='flex items-center text-xs space-x-3'>
        <span className='w-10 text-slate-400'>Max:</span>
        <input
          type='range'
          name='max'
          min={range.min}
          max={max}
          value={range.max}
          onChange={handleInputChange}
          className='flex-1 accent-blue-500 cursor-pointer'
        />
      </div>
    </div>
  )
}
