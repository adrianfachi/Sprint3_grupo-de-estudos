import ClearDayIcon from '../assets/Weather=Clear, Moment=Day.svg'
import ClearNightIcon from '../assets/Weather=Clear, Moment=Night.svg'
import CloudyDayIcon from '../assets/Weather=Cloudy, Moment=Day.svg'
import CloudyNightIcon from '../assets/Weather=Clear, Moment=Night.svg'
import RainDayIcon from '../assets/Weather=Rain, Moment=Day.svg'
import RainNightIcon from '../assets/Weather=Rain, Moment=Night.svg'
import SnowDayIcon from '../assets/Weather=Snow, Moment=Day.svg'
import SnowNightIcon from '../assets/Weather=Snow, Moment=Night.svg'
import StormDayIcon from '../assets/Weather=Storm, Moment=Day.svg'
import StormNightIcon from '../assets/Weather=Snow, Moment=Night.svg'

export default function getIcon(clima: string, hour: number) {
    const isNight = hour < 6 || hour >= 18
    const normalized = clima.toLowerCase()
    if (normalized.includes('clear')) {
        return isNight ? ClearNightIcon : ClearDayIcon
    }
    if (normalized.includes('rain')) {
        return isNight ? RainNightIcon : RainDayIcon
    }
    if (normalized.includes('snow')) {
        return isNight ? SnowNightIcon : SnowDayIcon
    }
    if (normalized.includes('storm')) {
        return isNight ? StormNightIcon : StormDayIcon
    }
    if (normalized.includes('cloudy') || normalized.includes('overcast')) {
        return isNight ? CloudyNightIcon : CloudyDayIcon
    }
    return isNight ? ClearNightIcon : ClearDayIcon
}