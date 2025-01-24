import axios from 'axios'
import { options } from './api'

export const getLogos = async (url, setLogo) => {
  const logoData = await axios.get(url, options)
  if (logoData.data.logos && logoData.data.logos.length > 0) {
    const filteredLogos = logoData.data.logos.filter(
      logo => logo.iso_639_1 === 'en'
    )
    if (filteredLogos.length > 0) {
      setLogo(filteredLogos[0].file_path)
    } else {
      setLogo(logoData.logos[0].file_path)
    }
  }
}
