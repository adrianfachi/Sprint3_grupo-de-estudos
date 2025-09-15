import ClearDay from '../assets/ClearDay.svg'
import ClearNight from '../assets/ClearNight.svg'
import CloudyDay from '../assets/CloudyDay.svg'
import CloudyNight from '../assets/CloudyNight.svg'
import RainDay from '../assets/RainDay.svg'
import RainNight from '../assets/RainNight.svg'
import SnowDay from '../assets/SnowDay.svg'
import SnowNight from '../assets/SnowNight.svg'
import StormDay from '../assets/StormDay.svg'
import StormNight from '../assets/StormNight.svg'
import Default from '../assets/RainNight.svg'

export default function getBackgroundImage(clima: string, hour: number) {
    const isNight = hour < 6 || hour >= 18
        const normalized = clima.toLowerCase()
        if (normalized.includes('clear')) {
            return isNight ? `url(${ClearNight})` : `url(${ClearDay})`
        }
        if (normalized.includes('rain')) {
            return isNight ? `url(${RainNight})` : `url(${RainDay})`
        }
        if (normalized.includes('snow')) {
            return isNight ? `url(${SnowNight})` : `url(${SnowDay})`
        }
        if (normalized.includes('storm')) {
            return isNight ? `url(${StormNight})` : `url(${StormDay})`
        }
        if (normalized.includes('cloudy') || normalized.includes('overcast')) {
            return isNight ? `url(${CloudyNight})` : `url(${CloudyDay})`
        }
        return `url(${Default})`
}