import React from 'react'
import Slider from 'rc-slider'
import 'rc-slider/assets/index.css'

const MultiRangeSlider = ({ min, max, onChange }) => {
  const [values, setValues] = React.useState([min, max])

  const handleRangeChange = newValues => {
    setValues(newValues)
    onChange({ min: newValues[0], max: newValues[1] })
  }

  return (
    <div className='multi-range-slider'>
      <Slider
        range
        min={min}
        max={max}
        value={values}
        onChange={handleRangeChange}
        trackStyle={[{ backgroundColor: '#007bff', height: 6 }]}
        handleStyle={[
          { borderColor: '#007bff', height: 16, width: 16 },
          { borderColor: '#007bff', height: 16, width: 16 }
        ]}
        railStyle={{ backgroundColor: '#ddd', height: 6 }}
      />
    </div>
  )
}

export default MultiRangeSlider
